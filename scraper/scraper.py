#!/usr/bin/env python3

# This script will attempt to scrape allcoursees from the catalog URL provided.
# It is not guaranteed to generate correct data, but it should at least generate
# a good starting point, which can then be corrected manually.

from dataclasses import dataclass, asdict
from enum import Enum

from bs4 import BeautifulSoup
import requests as r

from pocketbase import PocketBase

import json
import pprint

@dataclass
class Course:
    id: str
    subject: str
    number: str
    title: str
    credits: int
    attributes: list[str]

@dataclass
class Section:
    course_id: str
    number: int
    instructor: str
    location: str
    days: str
    times: str

distributions = {
    "arts": "AR",
    "humanities": "HU",
    "social": "SB",
    "natural": "NS",
    "math": "MT",
    "language": "WL",
    "culture": "WC",
    "united states": "US",
    "international": "INTL",
}

subject_listings_url = "https://www.umb.edu/course_catalog/listing/ugrd"
course_listings_url = "https://www.umb.edu/course_catalog/courses/ugrd_{subject}_all"
course_info_url = "https://www.umb.edu/course_catalog/course_info/ugrd_{subject}_all_{number}"

courses = []
sections = []

pb = PocketBase('http://127.0.0.1:8090')
pb_admin = pb.admins.auth_with_password("jkotlerj@gmail.com", "!%yr#Nt6LBGbT4CL")

subjects_page = r.get(subject_listings_url).text
subjects = BeautifulSoup(subjects_page, 'html.parser').find('div', {'id': 'content'}).find_all('li')
subjects = [s.text.split(' |')[0].strip() for s in subjects]

print(f"{len(subjects)} subjects found ({subjects})")

course_id = 1

for subject in subjects:
    s = r.get(course_listings_url.format(subject=subject)).text

    subject_courses = BeautifulSoup(s, features="html.parser").find("ul", {"class": "showHideList"}).find_all("li")

    for course in subject_courses:
        if h := course.find("h4"):
            course_number = h.text.split("\xa0\xa0")[0].rsplit(' ')[1]
            course_title = h.text.split("\xa0\xa0")[1].replace(" + ", "")

            course_page = r.get(course_info_url.format(subject=subject, number=course_number)).text
            course_page = BeautifulSoup(course_page, features="html.parser")

            # credits
            try:
                course_credits = course_page.find_all("span", {"class": "class-div-info"})[5]
                course_credits = course_credits.contents[0][0]
            except Exception:
                course_credits = ""

            # attributes
            try:
                course_attributes = course_page.find_all("span", {"class": "class-div-info"})[8].contents[0].lower()
                temp = []

                for k, v in distributions.items():
                    if k in course_attributes:
                        temp.append(v)

                course_attributes = temp
            except Exception:
                course_attributes = []

            courses.append(
                asdict(
                    Course(
                        str(course_id).zfill(15),
                        subject,
                        course_number,
                        course_title,
                        course_credits,
                        course_attributes,
                    )
                )
            )

            print(courses[-1])
            # pb.collection("courses").create(courses[-1])

            # sections
            semesters = course_page.find_all("h3")[1:]
            section_tables = course_page.find_all("table")
            
            for semester, semester_table in zip(semesters, section_tables):

                for section in semester_table.find_all("tr", {"class": "class-info-rows"}):
                    section_number = section.find("td", {"data-label": "Section"}).contents[0]
                    section_meeting = section.find("td", {"data-label": "Schedule/Time"}).contents
                    section_instructor = " ".join(section.find("td", {"data-label": "Instructor"}).contents[0].strip().split(",")[::-1])
                    section_location = section.find("td", {"data-label": "Location"}).contents

                    section_location = section_location[0] if section_location != [] else None

                    section_days, section_time = None, None
                    if len(section_meeting) == 3:
                        section_days = section_meeting[0]
                        section_time = section_meeting[2]

                    sections.append(
                        asdict(
                            Section(
                                str(course_id).zfill(15),
                                section_number,
                                section_instructor,
                                section_location,
                                section_days,
                                section_time,
                            )
                        )
                    )

                    print(sections[-1])
                    # pb.collection("sections").create(sections[-1])



            course_id += 1


    print(f"{subject} done")


pprint.pp(courses)