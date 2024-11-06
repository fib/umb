#!/usr/bin/env python3

# This script will attempt to scrape all classes from the catalog URL provided.
# It is not guaranteed to generate correct data, but it should at least generate
# a good starting point, which can then be corrected manually.

from dataclasses import dataclass, asdict
from enum import Enum

from bs4 import BeautifulSoup
import requests as r

import json
import pprint

@dataclass
class Class:
    id: int
    subject: str
    number: str
    title: str
    credits: int
    attributes: list[str]
    sections: dict

@dataclass
class Section:
    course_id: int
    number: int
    days: str
    times: list[str]

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

attributes = {}

subjects_page = r.get(subject_listings_url).text
subjects = BeautifulSoup(subjects_page, 'html.parser').find('div', {'id': 'content'}).find_all('li')
subjects = [s.text.split(' |')[0].strip() for s in subjects]

print(f"{len(subjects)} subjects found ({subjects})")

course_id = 1

for subject in subjects:
    s = r.get(course_listings_url.format(subject=subject)).text

    subject_courses = BeautifulSoup(s, features="html.parser").find("ul", {"class": "showHideList"}).find_all("li")

    # current subject being processed
    subject_list = []

    for course in subject_courses:
        if h := course.find("h4"):
            course_number = h.text.split("\xa0\xa0")[0].rsplit(' ')[1]
            course_title = h.text.split("\xa0\xa0")[1].replace(" + ", "")

            print(course_info_url.format(subject=subject, number=course_number))

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

            # sections
            try:
                course_sections = {}
                semesters = course_page.find_all("h3")[1:]
                section_tables = course_page.find_all("table")
                
                for semester, semester_table in zip(semesters, section_tables):
                    course_sections[semester.contents[0]] = []

                    for section in semester_table.find_all("tr", {"class": "class-info-rows"}):
                        section_number = section.find("td", {"data-label": "Section"}).contents[0]
                        section_meeting = section.find("td", {"data-label": "Schedule/Time"}).contents

                        section_days, section_time = None, None
                        if len(section_meeting) == 3:
                            section_days = section_meeting[0]
                            section_time = section_meeting[2]

                        course_sections[semester.contents[0]].append({
                            "number": section_number,
                            "days": section_days,
                            "time": section_time
                        })

            except Exception:
                course_sections = {}


            courses.append(
                asdict(
                    Class(
                        course_id,
                        subject,
                        course_number,
                        course_title,
                        course_credits,
                        course_attributes,
                        course_sections
                    )
                )
            )

            course_id += 1

            print(courses[-1])

    print(f"{subject} done")


pprint.pp(courses)

# with open("../course_catalog.json", "w") as f:
#     json.dump({"subjects": subjects, "courses": courses}, f)
