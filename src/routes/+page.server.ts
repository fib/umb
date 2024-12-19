import type { PageServerLoad } from './$types';
import PocketBase from 'pocketbase';

export const load: PageServerLoad = async ({ params }) => {
	const pb = new PocketBase('http://127.0.0.1:8090');

	await pb.admins.authWithPassword('jkotlerj@gmail.com','!%yr#Nt6LBGbT4CL');

	const courses = await pb.collection('courses').getList(1, 50);

	for (var c of courses.items) {
		c.sections = await pb.collection('sections').getFullList({
			filter: `course_id = "${c.id}"`,
		});
		console.log('sections$');
		console.log(c.sections);
	}

	return courses;
};