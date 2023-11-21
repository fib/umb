package main

import (
	"fmt"
	"strings"

	"github.com/gocolly/colly"
)

func main() {
	ugradSubjectPagePath := "https://courses.umb.edu/course_catalog/courses/ugrd_%s_2024%%20Spring"
	gradSubjectPagePath := "https://courses.umb.edu/course_catalog/courses/grd_%s_2024%%20Spring"

	grad := false

	subjectCollector := colly.NewCollector(
		colly.AllowedDomains("courses.umb.edu"),
		colly.CacheDir("./.umb_catalog_cache"),
	)

	courseCollector := subjectCollector.Clone()

	subjectCollector.OnHTML(".unit-50", func(e *colly.HTMLElement) {
		subjectPagePath := ugradSubjectPagePath

		if grad {
			subjectPagePath = gradSubjectPagePath
		}

		fmt.Println("grad:", grad)

		e.ForEach("li", func(_ int, e *colly.HTMLElement) {
			subjectCode := strings.TrimSpace(strings.Split(e.Text, "|")[0])

			fmt.Println(subjectCode)

			courseCollector.Visit(fmt.Sprintf(subjectPagePath, subjectCode))
		})

		grad = true
		// fmt.Println(fmt.Sprintf(subjectPagePath, subjectCode))
	})

	courseCollector.OnHTML("#content ul a[href]", func(e *colly.HTMLElement) {
		fmt.Println("Course:", e.Text)
	})

	subjectCollector.Visit("https://courses.umb.edu/course_catalog/subjects/2024%20Spring")
}
