import type { PageServerLoad } from './$types';
import { PB_HOST, PB_USER, PB_PASSWORD } from '$env/static/private';
import PocketBase from 'pocketbase';

export const load: PageServerLoad = async ({ url }) => {
	const query = {
		search: url.searchParams.get('search'),
		subjects: url.searchParams.get('subjects')?.split(','),
		attributes: url.searchParams.get('attributes')?.split(','),
		instructor: url.searchParams.get('instructor'),
	};

	let coursesFilter = '';

	if (query.search) {
		const tokens = query.search.split(/\s+/);
		coursesFilter += `(${tokens.map(t => `(title ~ "${t}")`).join(' || ')})`;
	}

	if (query.subjects) {
		if (coursesFilter != '') coursesFilter += ' && ';
		coursesFilter += `(${query.subjects.map(s => `subject = "${s}"`).join(' || ')})`;
	}

	if (query.attributes) {
		if (coursesFilter != '') coursesFilter += ' && ';
		coursesFilter += `(${query.attributes?.map(a => `attributes ~ "${a}"`).join(' || ')})`;
	}

	const pb = new PocketBase(PB_HOST);

	await pb.admins.authWithPassword(PB_USER, PB_PASSWORD);

	if (query.instructor && query.instructor != "") {
		let filter = `(${query.instructor.split(/\s+/).map(t => `name ~ "${t}"`).join(' || ')})`;
		if (query.search) filter += ` && (${query.search.split(/\s+/).map(t => `course.title ~ "${t}"`).join(' || ')})`;

		console.log(filter);

		const instructorCourses = await pb.collection('instructors').getList(1, 50, {
			filter,
			expand: "course",
		});

		console.log(instructorCourses.items.map(c => c.expand).map(c => c?.course));
		const courses = instructorCourses.items.map(c => c.expand).map(c => c?.course);

		let sectionsFilter = courses.map(c => `course_id = "${c.id}"`).join(" || ");

		console.log(sectionsFilter);

		return {
			courses: courses,
			sections: pb.collection('sections').getFullList({
				filter: sectionsFilter
			})
		}
	}

	const courses = await pb.collection('courses').getList(1, 50, {
		filter: coursesFilter,
	});

	let sectionsFilter = courses.items.map(c => `course_id = "${c.id}"`).join(" || ");
console.log(sectionsFilter);
	return {
		courses: courses.items,
		sections: pb.collection('sections').getFullList({
			filter: sectionsFilter
		})
	}
};