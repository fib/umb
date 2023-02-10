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
	let subjects_filter = data.subjects;

	$: selection = {
		number: search,
		attributes: attributes_filter.join(' '),
		credits: subjects_filter
	};

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
			searchValue: (v) => v.a.sort().join(' '),
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

	let modal;

	function clearFilters() {
		attributes_filter = [];
		subjects_filter = [];
		search = '';
	}
</script>

<h2>UMass Boston Course Catalog</h2>

<!-- svelte-ignore a11y-missing-attribute -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<a on:click={modal.showModal()} class="secondary"><small>About this tool</small></a>

<dialog bind:this={modal}>
	<article>
		<header>
			<!-- svelte-ignore a11y-missing-content -->
			<!-- svelte-ignore a11y-missing-attribute -->
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<a on:click={modal.close()} aria-label="Close" class="close" />
			About
		</header>

		<p>
			This tool aims to provide a convenient way to browse courses offered at UMass Boston. It
			enables you to filter courses by keywords, subjects, and gen-ed/diversity attributes.
		</p>
		<p>
			This page loads large amounts of data which might cause some devices to slow down. If you are
			experiencing poor performance, try selecting fewer subjects from the dropdown menu.
		</p>

		<footer style="text-align: left">
			This website is <b>not</b> affiliated with UMass Boston. Refer to the
			<a href="https://www.umb.edu/course_catalog">official UMB course catalog</a>
			for the most accurate information.
		</footer>
		<p />
	</article>
</dialog>

<div class="grid filters">
	<input class="div1" type="search" style="width: 100%" bind:value={search} placeholder="Search" />

	<details role="list" class="div2">
		<summary aria-haspopup="listbox">Subjects</summary>
		<ul role="listbox" class="dropdown">
			{#each data.subjects as subject}
				<li>
					<label>
						<input type="checkbox" bind:group={subjects_filter} value={subject} />
						{subject}
					</label>
				</li>
			{/each}
		</ul>
	</details>

	<details role="list" class="div3">
		<summary aria-haspopup="listbox">Course attributes</summary>
		<ul role="listbox" class="dropdown">
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
	<button class="div4 outline" on:click={clearFilters}>Clear</button>
</div>

<SvelteTable
	classNameTable="table"
	{columns}
	rows={data.courses}
	bind:filterSelections={selection}
/>

<style>
	.filters {
		margin-top: 3vh;
		display: grid;
		grid-template-columns: repeat(8, 1fr);
		grid-template-rows: 1fr;
	}
	.div1 {
		grid-area: 1 / 1 / 2 / 3;
	}
	.div2 {
		grid-area: 1 / 3 / 2 / 5;
	}
	.div3 {
		grid-area: 1 / 5 / 2 / 8;
	}
	.div4 {
		grid-area: 1 / 8 / 2 / 9;
	}
	@media only screen and (max-width: 1000px) {
		.filters {
			grid-template-columns: repeat(5, 1fr);
			grid-template-rows: repeat(2, 1fr);
		}
		.div1 {
			grid-area: 1 / 1 / 2 / 4;
		}
		.div2 {
			grid-area: 1 / 4 / 2 / 6;
		}
		.div3 {
			grid-area: 2 / 1 / 3 / 4;
		}
		.div4 {
			grid-area: 2 / 4 / 3 / 6;
		}
	}
	.dropdown {
		overflow-y: scroll;
		max-height: 30vh;
	}
</style>
