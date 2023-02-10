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
    s: str       # subject
    n: str       # number
    t: str       # title
    c: int       # credits
    a: list[str] # attributes

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


for subject in subjects:
    s = r.get(course_listings_url.format(subject=subject)).text

    subject_courses = BeautifulSoup(s, features="html.parser").find("ul", {"class": "showHideList"}).find_all("li")

    # current subject being processed
    subject_list = []

    for course in subject_courses:
        if h := course.find("h4"):
            course_number = h.text.split("\xa0\xa0")[0].rsplit(' ')[1]
            course_title = h.text.split("\xa0\xa0")[1].replace(" + ", "")

            course_page = r.get(course_info_url.format(subject=subject, number=course_number)).text
            course_page = BeautifulSoup(course_page, features="html.parser")

            # attempting to retrieve the course credits and attributes
            try:
                course_credits = course_page.find_all("span", {"class": "class-div-info"})[5]
                course_credits = course_credits.contents[0][0]
            except Exception:
                course_credits = ""

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
                    Class(
                        subject,
                        course_number,
                        course_title,
                        course_credits,
                        course_attributes 
                    )
                )
            )

            print(courses[-1])

    print(f"{subject} done")


pprint.pp(courses)

with open("../course_catalog.json", "w") as f:
    json.dump({"subjects": subjects, "courses": courses}, f)
