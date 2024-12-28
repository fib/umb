<script lang="ts">
	import type { PageData } from "./$types";
	import { page, navigating } from "$app/state";
	import { goto } from "$app/navigation";
	import { subjects, attributes, courseUrl } from "$lib/consts";
	import { debounce } from "$lib/util";

	let { data }: { data: PageData } = $props();

	let search = $state(page.url.searchParams.get("search"));
	let instructor = $state(page.url.searchParams.get("instructor"));

	let subjectsSelected = $state(
		page.url.searchParams.get("subjects")
			? page.url.searchParams.get("subjects")?.split(",")
			: [],
	);
	let attributesSelected = $state(
		page.url.searchParams.get("attributes")
			? page.url.searchParams.get("attributes")?.split(",")
			: [],
	);

	function doSearch() {
		let params = "";

		if (search && search != "") params += `search=${search}`;

		if (subjectsSelected && subjectsSelected.length > 0) {
			if (params != "") params += "&";
			params += `subjects=${subjectsSelected?.join(",")}`;
		}

		if (attributesSelected && attributesSelected.length > 0) {
			if (params != "") params += "&";
			params += `attributes=${attributesSelected.join(",")}`;
		}

		if (instructor && instructor != "") {
			if (params != "") params += "&";
			params += `instructor=${instructor}`;
		}

		if (params != "") params = `?${params}`;

		goto(params != "" ? params : "/", { keepFocus: true });
	}

	function toggleSections(id: string) {
		const sections = document.querySelectorAll<HTMLElement>(
			`[data-id='${id}']`,
		);

		const arrow = document.getElementById(`arrow-${id}`);

		if (sections.length > 0) {
			sections.forEach((s) => {
				s.style.display =
					s.style.display == "none" || s.style.display == ""
						? "table-row"
						: "none";
			});

			arrow?.classList.toggle("upside-down");
		}
	}
</script>

<div class="container">
	<div class="container grid" id="search-container">
		<input
			id="search-field"
			placeholder="Search"
			type="search"
			bind:value={search}
			oninput={debounce(doSearch)}
		/>
		<input
			id="instructor-field"
			placeholder="Instructor"
			type="search"
			bind:value={instructor}
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
				instructor = "";
				subjectsSelected = [];
				attributesSelected = [];
				doSearch();
			}}>Clear</button
		>
	</div>
	{#if navigating.to}
		<progress></progress>
	{/if}
	<div id="table-container" class="overflow-auto">
		<table>
			<thead>
				<tr>
					<th></th>
					<th class="course-number">#</th>
					<th class="course-title">Title</th>
					<th class="course-credits">Credits</th>
					<th class="course-attributes">Attributes</th>
					<th class="course-sections">Sections</th>
				</tr>
			</thead>
			<tbody>
				{#each data.courses as course}
					<tr class="course-row">
						<td class="course-number-link"
							><a
								class="secondary"
								href={courseUrl(course.subject, course.number)}
								>🔗</a
							></td
						>
						<td class="course-number"
							>{course.subject}{course.number}</td
						>
						<td class="course-title">{course.title}</td>
						<td>{course.credits}</td>
						<td>{course.attributes}</td>
						<td class="course-sections-value">
							{#await data.sections}
								⏳
							{:then sections}
								{@const sectionsCount = sections.filter(
									(s) => s.course_id == course.id,
								).length}
								{#if sectionsCount > 0}
									<!-- svelte-ignore a11y_invalid_attribute -->
									<a
										onclick={() => {
											toggleSections(course.id);
										}}
										href="javascript:;"
										class="sections-arrow secondary"
									>
										{sectionsCount}
										<span
											id="arrow-{course.id}"
											class="material-symbols-outlined"
										>
											arrow_drop_down
										</span>
									</a>
								{/if}
							{/await}
						</td>
					</tr>
					{#await data.sections}
						<!--  -->
					{:then sections}
						{@const course_sections = sections.filter(
							(s) => s.course_id == course.id,
						)}
						{#if course_sections.length > 0}
							<tr class="sections" data-id={course.id}>
								<td class="sections-cell" colspan="6">
									<div>
										<table class="section-table">
											<thead>
												<tr>
													<th class="section-number"
														>#</th
													>
													<th
														class="section-instructor"
														>Instructor</th
													>
													<th>Location</th>
													<th>Meetings</th>
												</tr>
											</thead>
											<tbody>
												{#each course_sections as section}
													<tr>
														<td>{section.number}</td
														>
														<td
															>{section.instructor}</td
														>
														<td
															>{section.location}</td
														>
														<td
															>{section.days}{section.times}</td
														>
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

	#table-container {
		margin-bottom: 5rem;
	}

	@media (max-width: 1100px) {
		#search-container > #search-field {
			grid-area: a;
		}

		#search-container > #instructor-field {
			grid-area: b;
		}

		#search-container > #subjects-select {
			grid-area: c;
		}

		#search-container > #attributes-select {
			grid-area: d;
		}

		#search-container > button {
			grid-area: e;
		}

		#search-container {
			grid-template:
				"a a" auto
				"b b" auto
				"c d" auto
				"e e" auto / 1fr 1fr;
		}

		summary > span {
			width: 80%;
		}
	}

	@media (min-width: 1101px) {
		#search-container {
			width: 100%;
			grid-template-columns: 4fr 4fr 2fr 2fr 1fr;
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

	.course-number-link {
		font-size: 0.7rem;
		vertical-align: middle;
		padding-right: 0.6rem;
	}

	.course-number-link > a {
		padding: 0;
	}

	.sections-arrow > span {
		user-select: none;
		vertical-align: sub;
		cursor: pointer;
	}

	.sections-arrow {
		text-decoration-line: none;
	}

	:global(.upside-down) {
		transform: rotate(180deg);
	}

	.course-sections-value {
		align-items: end;
		align-content: end;
		text-align: right;
	}

	.dropdown > ul {
		max-height: 15rem;
		overflow-y: auto;
	}

	.sections {
		display: none;
	}

	.section-table {
		margin-bottom: 0;
		font-size: 0.85rem;
	}

	.section-table td,
	.section-table th {
		background-color: var(--pico-table-row-stripped-background-color);
		padding: 0.5rem;
	}

	.course-title {
		width: 60%;
	}

	.course-number {
		padding-left: 0;
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
