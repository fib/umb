<script lang="ts">
	import type { PageData } from "./$types";
	import { subjects, attributes } from "$lib/consts";

	let { data }: { data: PageData } = $props();

	let search = $state("");

	let subjectsSelected = $state([]);
	let attributesSelected = $state([]);

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
			id="search-field"
			placeholder="Search"
			type="text"
			bind:value={search}
		/>
		<details id="subjects-select" class="dropdown">
			<summary>
				<span>
					{#if subjectsSelected.length == 0}
						Subjects
					{:else}
						{subjectsSelected.join(", ")}
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
		<details id="attributes-select" class="dropdown">
			<summary>
				<span>
					{#if attributesSelected.length == 0}
						Attributes
					{:else}
						{attributesSelected.join(", ")}
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
	</div>
	<div id="table-container">
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
				{#each data.items as course}
					<tr
						class="course-row"
						onclick={() => toggleSections(course.id)}
					>
						<td>{course.subject}{course.number}</td>
						<td class="course-title">{course.title}</td>
						<td>{course.credits}</td>
						<td>{course.attributes}</td>
						<td>{course.sections.length}</td>
					</tr>
					{#if course.sections.length > 0}
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
											{#each course.sections as section}
												<tr>
													<td>{section.number}</td>
													<td>{section.instructor}</td
													>
													<td>{section.location}</td>
													<td
														>{section.days}
														{section.times}</td
													>
												</tr>
											{/each}
										</tbody>
									</table>
								</div>
							</td>
						</tr>
					{/if}
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
		margin-top: 5rem;
	}

	@media (max-width: 1100px) {
		#search-container {
			grid-template:
				"a a" auto
				"b c" auto / 1fr 1fr;
		}
	}

	@media (min-width: 1101px) {
		#search-container {
			grid-template-columns: 3fr 1fr 1fr;
		}
	}

	summary > span {
		position: absolute;
		width: 70%;
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
