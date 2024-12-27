import type { PageServerLoad } from './$types';
import { PB_HOST, PB_USER, PB_PASSWORD } from '$env/static/private';
import PocketBase from 'pocketbase';

export const load: PageServerLoad = async ({ url }) => {
	const query = {
		search: url.searchParams.get('search'),
		subjects: url.searchParams.get('subjects')?.split(','),
		attributes: url.searchParams.get('attributes')?.split(','),
	};

	let coursesFilter = '';

	if (query.search) {
		let tokens = query.search.split(/\s+/);
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

	const courses = await pb.collection('courses').getList(1, 50, {
		filter: coursesFilter,
	});

	let sectionsFilter = courses.items.map(c => `course_id = "${c.id}"`).join(" || ");

	return {
		courses: courses.items,
		sections: pb.collection('sections').getFullList({
			filter: sectionsFilter
		})
	}
};