<script>
	import SvelteTable from 'svelte-table';

    const attributes = ['International', 'World Cultures', 'Humanities'];

    let search = '';
    let attributes_filter = [];

	$: selection = { number: search, attributes: attributes_filter.join(" ") };

	const columns = [
		{
			key: 'number',
			title: '#',
			value: (v) => v.number + v.title,
            renderValue: (v) => `<a href=${v.url}>${v.number}</a>`,
			searchValue: (v, s) => {
                let row = v.number + v.title;
                row = row.toLowerCase();

                return s.toLowerCase().split(" ").every(t => row.includes(t))
            },
			sortable: false,
            hideFilterHeader: true,
		},
		{
			key: 'title',
			title: 'Title',
			value: (v) => v.title,
			sortable: false,
			searchValue: (v) => v.title,
			hideFilterHeader: true
		},
		{
			key: 'attributes',
			title: 'Attributes',
			value: (v) => v.attributes.join(", "),
			sortable: false,
			searchValue: (v) => v.attributes.join(" "),
			hideFilterHeader: true
		},
		{
			key: 'credits',
			title: 'Credits',
			value: (v) => v.credits,
			sortable: false
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

<div class='grid'>
<input type='search' bind:value={search} placeholder='Search' />

<details role='list'>
    <summary aria-haspopup='listbox'>Course attributes</summary>
    <ul role='listbox'>
        {#each attributes as attr}
        <li>
            <label>
                <input type='checkbox' bind:group={attributes_filter} value={attr}>
                {attr}
            </label>
        </li>
        {/each}
    </ul>
</details>
</div>

<SvelteTable classNameTable="table" columns={columns} rows={test_data} bind:filterSelections={selection} />
