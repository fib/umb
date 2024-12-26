import type { PageServerLoad } from './$types';
import PocketBase from 'pocketbase';

export const load: PageServerLoad = async ({ url }) => {
	const query = {
		search: url.searchParams.get('search'),
		subjects: url.searchParams.get('subjects')?.split(','),
		attributes: url.searchParams.get('attributes')?.split(','),
	};

	let searchFilter = '';

	if (query.search) {
		let tokens = query.search.split(/\s+/);
		searchFilter += `(${tokens.map(t => `(title ~ "${t}")`).join(' || ')})`;
	}

	if (query.subjects) {
		if (searchFilter != '') searchFilter += ' && ';
		searchFilter += `(${query.subjects.map(s => `subject = "${s}"`).join(' || ')})`;
	} 

	if (query.attributes) {
		if (searchFilter != '') searchFilter += ' && ';
		searchFilter += `(${query.attributes?.map(a => `attributes ~ "${a}"`).join(' || ')})`;
	}

	console.log(searchFilter);

	const pb = new PocketBase('http://127.0.0.1:8090');

	await pb.admins.authWithPassword('jkotlerj@gmail.com', '!%yr#Nt6LBGbT4CL');

	const courses = await pb.collection('courses').getList(1, 50, {
		filter: searchFilter,
	});

	for (var c of courses.items) {
		c.sections = await pb.collection('sections').getFullList({
			filter: `course_id = "${c.id}"`,
		});
	}

	return courses;
};