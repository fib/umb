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

	const fieldPrefix = (query.instructor && query.instructor != "") ? "course." : "";
	let courses;
	let coursesFilter = '';
	const instructorTokens = query.instructor?.split(/\s+/);

	if (query.search) {
		const tokens = query.search.split(/\s+/);
		coursesFilter += `(${tokens.map(t => `${fieldPrefix}title ~ "${t}"`).join(' || ')})`;
	}

	if (query.subjects) {
		if (coursesFilter != '') coursesFilter += ' && ';
		coursesFilter += `(${query.subjects.map(s => `${fieldPrefix}subject = "${s}"`).join(' || ')})`;
	}

	if (query.attributes) {
		if (coursesFilter != '') coursesFilter += ' && ';
		coursesFilter += `(${query.attributes?.map(a => `${fieldPrefix}attributes ~ "${a}"`).join(' || ')})`;
	}

	const pb = new PocketBase(PB_HOST);

	await pb.admins.authWithPassword(PB_USER, PB_PASSWORD);

	if (query.instructor && query.instructor != "") {
		if (coursesFilter != "") coursesFilter += " && ";
		coursesFilter += `(${instructorTokens?.map(t => `name ~ "${t}"`).join(' || ')})`;
		const instructorCourses = await pb.collection('instructors').getList(1, 50, {
			filter: coursesFilter,
			expand: "course",
		});

		courses = instructorCourses.items.map(c => c.expand).map(c => c?.course);
	} else {
		courses = await pb.collection('courses').getList(1, 50, {
			filter: coursesFilter,
			expand: "course"
		});

		courses = courses.items;
	}

	let sectionsFilter = `(${courses.map(c => `course_id = "${c.id}"`).join(" || ")})`;
	if (instructorTokens && instructorTokens.length > 0) sectionsFilter += ` && (${instructorTokens?.map(t => `instructor ~ "${t}"`).join(" || ")})`;

	return {
		courses: courses,
		sections: pb.collection('sections').getFullList({
			filter: sectionsFilter
		})
	}
};