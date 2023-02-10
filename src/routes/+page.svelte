<script>
	import SvelteTable from 'svelte-table';

	import data from './course_catalog.json';

	const attributes = {
		Arts: 'AR',
		Humanities: 'HU',
		'International Diversity': 'INTL',
		'Mathematics/Technology': 'MT',
		'Natural Sciences': 'NS',
		'Social and Behavioral Studies': 'SB',
		'United States Diversity': 'US',
		'World Languages': 'WL',
		'Word Cultures': 'WC'
	};

	let search = '';
	let attributes_filter = [];
	let subjects_filter = [];

	$: selection = {
		number: search,
		attributes: attributes_filter.join(' '),
		credits: subjects_filter
	};

	$: console.log(subjects_filter);

	const columns = [
		{
			key: 'number',
			title: '#',
			value: (v) => v.s + v.n,
			renderValue: (v) =>
				`<a href='https://www.umb.edu/course_catalog/course_info/ugrd_${v.s}_all_${v.n}'>${
					v.s + v.n
				}</a>`,
			searchValue: (v, s) => {
				let row = v.n + v.t;
				row = row.toLowerCase();

				return s
					.toLowerCase()
					.split(' ')
					.every((t) => row.includes(t));
			},
			sortable: false,
			hideFilterHeader: true
		},
		{
			key: 'title',
			title: 'Title',
			value: (v) => v.t,
			sortable: false,
			searchValue: (v) => v.t,
			hideFilterHeader: true
		},
		{
			key: 'attributes',
			title: 'Attributes',
			value: (v) => v.a.join(', '),
			sortable: false,
			searchValue: (v) => v.a.join(' '),
			hideFilterHeader: true
		},
		{
			key: 'credits',
			title: 'Credits',
			value: (v) => v.c,
			sortable: false,
			hideFilterHeader: true,
			searchValue: (v, s) => subjects_filter.includes(v.s)
		}
	];

	const test_data = [
		{
			url: 'https://www.umb.edu/course_catalog/course_info/ugrd_CS_all_240',
			number: 'CS240',
			title: 'Programming in C',
			credits: '3',
			attributes: []
		},
		{
			url: 'https://www.umb.edu/course_catalog/course_info/ugrd_CLSICS_all_281',
			number: 'CLSICS281',
			title: 'Greek Civilization: Multi-Cultural Perspectives',
			credits: '3',
			attributes: ['International', 'World Cultures']
		},
		{
			url: 'https://www.umb.edu/course_catalog/course_info/ugrd_CLSICS_all_284',
			number: 'CLSICS284',
			title: 'Greek and Roman Mythology',
			credits: '3',
			attributes: ['International', 'Humanities']
		}
	];
</script>

<div class="grid filters">
	<input class="div1" type="search" style="width: 100%" bind:value={search} placeholder="Search" />

	<details role="list" class="div2">
		<summary aria-haspopup="listbox">Subject</summary>
		<ul role="listbox">
			{#each data.subjects as subject}
				<li>
					<label>
						<input type="checkbox" checked bind:group={subjects_filter} value={subject} />
						{subject}
					</label>
				</li>
			{/each}
		</ul>
	</details>

	<details role="list" class="div3">
		<summary aria-haspopup="listbox">Course attributes</summary>
		<ul role="listbox">
			{#each Object.keys(attributes) as attr}
				<li>
					<label>
						<input type="checkbox" bind:group={attributes_filter} value={attributes[attr]} />
						{attr}
					</label>
				</li>
			{/each}
		</ul>
	</details>
</div>

<SvelteTable
	style="overflow: scroll"
	classNameTable="table"
	{columns}
	rows={data.courses}
	bind:filterSelections={selection}
/>

<style>
	.filters {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		grid-template-rows: 1fr;
	}

	.div1 {
		grid-area: 1 / 1 / 2 / 3;
	}
	.div2 {
		grid-area: 1 / 3 / 2 / 4;
	}
	.div3 {
		grid-area: 1 / 4 / 2 / 6;
	}

	@media only screen and (max-width: 780px) {
		.filters {
			grid-template-columns: repeat(3, 1fr);
			grid-template-rows: repeat(2, 1fr);
		}
		.div1 {
			grid-area: 1 / 1 / 2 / 4;
		}
		.div2 {
			grid-area: 2 / 1 / 3 / 2;
		}
		.div3 {
			grid-area: 2 / 2 / 3 / 4;
		}
	}
	ul {
		overflow-y: scroll;
		max-height: 30vh;
	}
</style>
