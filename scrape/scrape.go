package main

import (
	"fmt"
	"strings"

	// mapset "github.com/deckarep/golang-set/v2"
	"github.com/gocolly/colly"
)

type course[T any] struct {
	subject string
	number  string
	title   string
	credits int
	attr    T /* modality, gened req, etc. */
}

func main() {
	ugradSubjectPagePath := "https://courses.umb.edu/course_catalog/courses/ugrd_%s_2024%%20Spring"
	gradSubjectPagePath := "https://courses.umb.edu/course_catalog/courses/grd_%s_2024%%20Spring"

	grad := false

	catalogCollector := colly.NewCollector(
		colly.AllowedDomains("courses.umb.edu"),
		colly.CacheDir("./.umb_catalog_cache"),
	)

	subjectCollector := catalogCollector.Clone()
	courseCollector := catalogCollector.Clone()

	// var currentCourse course

	catalogCollector.OnHTML(".unit-50", func(e *colly.HTMLElement) {
		subjectPagePath := ugradSubjectPagePath

		if grad {
			subjectPagePath = gradSubjectPagePath
		}

		fmt.Println("grad:", grad)

		e.ForEach("li", func(_ int, e *colly.HTMLElement) {
			subjectCode := strings.TrimSpace(strings.Split(e.Text, "|")[0])

			fmt.Println(subjectCode)

			subjectCollector.Visit(fmt.Sprintf(subjectPagePath, subjectCode))
		})

		grad = true
	})

	subjectCollector.OnHTML("#content ul a[href]", func(e *colly.HTMLElement) {
		// courseInfo := strings.Fields(e.Text)

		// currentCourse = course{
		// 	subject: courseInfo[0],
		// 	number:  courseInfo[1],
		// 	title:   courseInfo[2],
		// }

		courseCollector.Visit(e.Attr("href"))

		// fmt.Println(currentCourse)
	})

	/*
		Processes each course page. A course page contain a table with 2 rows
		for each section:
		<table>
			<thead>....</thead>
			<tbody>
				<!--- section number, catalog number, schedule, instructor, location --->
				<tr class="class-info-rows">....</tr>
				<tr class="extra-info">....</tr>
			</tbody>
		</table>
	*/
	// courseCollector.OnHTML("table", func(e *colly.HTMLElement) {
	// 	e.ForEach("tbody tr", func(i int, row *colly.HTMLElement) {
	// 		row.ForEach("td", func(j int, item *colly.HTMLElement) {
	// 			switch item.Attr("data-label") {
	// 			case "Location":
	// 				if item.Text == "On-line course" {
	// 					currentCourse.attr = append(currentCourse.attr, "Online")
	// 				}
	// 			}
	// 		})

	// 	})
	// })

	// courseCollector.OnHTML("tbody tr", func(row *colly.HTMLElement) {
	// 	fmt.Println(e.Attr("class"))
	// 	fmt.Println(currentCourse)

	// 	switch row.Attr("class") {
	// 	case "class-info-rows":
	// 		e.ForEach
	// 		break
	// 	case "extra-info":
	// 		break
	// 	}
	// })

	courseCollector.OnHTML("tbody tr.class-info-rows", func(row *colly.HTMLElement) {
		row.ForEach("td", func(i int, field *colly.HTMLElement) {
			switch field.Attr("data-label") {
			case "Location":
				switch field.Text {
				case "On-line course":
					// currentCourse.attr = append(currentCourse.attr, "Online")
				default:
					// currentCourse.attr = append(currentCourse.attr, "In-person")
				}
				break
			}
		})
	})

	courseCollector.OnHTML("tbody tr.extra-info", func(row *colly.HTMLElement) {
	})

	catalogCollector.Visit("https://courses.umb.edu/course_catalog/subjects/2024%20Spring")
}
