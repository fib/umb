<script lang="ts">
	import type { PageData } from "./$types";
	import { page } from "$app/stores";
	import { subjects, attributes } from "$lib/consts";
	import { goto } from "$app/navigation";

	let { data }: { data: PageData } = $props();

	console.log("$$$$$");

	console.log(data);

	const debounce = (callback: Function, wait = 200) => {
		let timeout: ReturnType<typeof setTimeout>;

		return (...args: any[]) => {
			clearTimeout(timeout);
			timeout = setTimeout(() => callback(...args), wait);
		};
	};

	let search = $state($page.url.searchParams.get("search"));

	let subjectsSelected = $state(
		$page.url.searchParams.get("subjects")
			? $page.url.searchParams.get("subjects")?.split(",")
			: [],
	);
	let attributesSelected = $state(
		$page.url.searchParams.get("attributes")
			? $page.url.searchParams.get("attributes")?.split(",")
			: [],
	);

	function doSearch() {
		let params = "";

		if (search != "") params += `search=${search}`;

		if (subjectsSelected.length > 0) {
			if (params != "") params += "&";
			params += `subjects=${subjectsSelected?.join(",")}`;
		}

		if (attributesSelected.length > 0) {
			if (params != "") params += "&";
			params += `attributes=${attributesSelected.join(",")}`;
		}

		if (params != "") params = `?${params}`;

		console.log(params);
		goto(params != "" ? params : "/");
	}

	function toggleSections(id: string) {
		const sections = document.querySelectorAll<HTMLElement>(
			`[data-id='${id}']`,
		);

		if (sections.length > 0) {
			sections.forEach((s) => {
				s.style.display =
					s.style.display == "none" || s.style.display == ""
						? "table-row"
						: "none";
			});
		}
	}
</script>

<div class="container">
	<div class="container grid" id="search-container">
		<input
			autofocus
			id="search-field"
			placeholder="Search"
			type="search"
			bind:value={search}
			oninput={debounce(doSearch)}
		/>
		<details
			oninput={debounce(doSearch)}
			id="subjects-select"
			class="dropdown"
		>
			<summary>
				<span>
					{#if subjectsSelected?.length == 0}
						Subjects
					{:else}
						{subjectsSelected?.join(", ")}
					{/if}
				</span>
			</summary>
			<ul id="subjects-dropdown">
				{#each subjects as subject}
					<li>
						<label>
							<input
								type="checkbox"
								bind:group={subjectsSelected}
								value={subject}
								name="subjects"
							/>
							{subject}
						</label>
					</li>
				{/each}
			</ul>
		</details>
		<details
			oninput={debounce(doSearch)}
			id="attributes-select"
			class="dropdown"
		>
			<summary>
				<span>
					{#if attributesSelected?.length == 0}
						Attributes
					{:else}
						{attributesSelected?.join(", ")}
					{/if}
				</span>
			</summary>
			<ul id="attributes-dropdown">
				{#each attributes as attr}
					<li>
						<label>
							<input
								type="checkbox"
								bind:group={attributesSelected}
								value={attr}
								name="attributes"
							/>
							{attr}
						</label>
					</li>
				{/each}
			</ul>
		</details>
		<button
			type="reset"
			onclick={() => {
				search = "";
				subjectsSelected = [];
				attributesSelected = [];
				doSearch();
			}}>Clear</button
		>
	</div>
	<div id="table-container" class="overflow-auto">
		<table>
			<thead>
				<tr>
					<th class="course-number">#</th>
					<th class="course-title">Title</th>
					<th class="course-credits">Credits</th>
					<th class="course-attributes">Attributes</th>
					<th class="course-sections">Sections</th>
				</tr>
			</thead>
			<tbody>
				{#each data.courses as course}
					<tr
						class="course-row"
						onclick={() => {
							toggleSections(course.id);
						}}
					>
						<td>{course.subject}{course.number}</td>
						<td class="course-title">{course.title}</td>
						<td>{course.credits}</td>
						<td>{course.attributes}</td>
						<td>
							{#await data.sections}
								.
							{:then sections}
								{sections.filter(
									(s) => s.course_id == course.id,
								).length}
							{/await}
						</td>
					</tr>
					{#await data.sections}
					<!--  -->
					{:then sections}
						{@const course_sections = sections.filter(s => s.course_id == course.id)}
						{#if course_sections.length > 0}
						<tr class="sections" data-id={course.id}>
							<td class="sections-cell" colspan="5">
								<div>
									<table class="section-table">
										<thead>
											<tr>
												<th class="section-number">#</th
												>
												<th class="section-instructor"
													>Instructor</th
												>
												<th>Location</th>
												<th>Meetings</th>
											</tr>
										</thead>
										<tbody>
											{#each course_sections as section}
												<tr>
													<td>{section.number}</td>
													<td>{section.instructor}</td>
													<td>{section.location}</td>
													<td>{section.days}{section.times}</td>
												</tr>
											{/each}
										</tbody>
									</table>
								</div>
							</td>
						</tr>
						{/if}
					{:catch error}
						<tr
							><td
								><p>
									error loading sections {error.message}
								</p></td
							></tr
						>
					{/await}
				{/each}
			</tbody>
		</table>
	</div>
</div>

<style>
	* {
		font-family: sans-serif;
	}

	#search-container {
		margin: 5rem 0 2rem;
	}

	@media (max-width: 1100px) {
		#search-container > #search-field {
			grid-area: a;
		}

		#search-container > #subjects-select {
			grid-area: b;
		}

		#search-container > #attributes-select {
			grid-area: c;
		}

		#search-container > button {
			grid-area: d;
		}

		#search-container {
			grid-template:
				"a a" auto
				"b c" auto
				"d d" auto / 1fr 1fr;
		}

		summary > span {
			width: 80%;
		}
	}

	@media (min-width: 1101px) {
		#search-container {
			width: 100%;
			grid-template-columns: 5fr 2fr 2fr 1fr;
		}

		summary > span {
			width: 70%;
		}
	}

	summary > span {
		position: absolute;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.dropdown > ul {
		max-height: 15rem;
		overflow-y: auto;
	}

	.sections {
		display: none;
	}

	.course-title {
		width: 60%;
	}

	.section-number {
		width: 3%;
	}

	.section-instructor {
		width: 45%;
	}

	.sections-cell {
		padding: 0;
	}

	.sections-cell > div {
		max-height: 15rem;
		overflow-y: auto;
	}

	::-webkit-scrollbar {
		width: 10px;
	}

	::-webkit-scrollbar-track-piece {
		background-color: var(--pico-constrast-background);
	}

	::-webkit-scrollbar-thumb {
		background-color: var(--pico-form-element-background-color);
	}

	::-webkit-scrollbar-thumb:hover {
		background-color: #909090;
	}
</style>
