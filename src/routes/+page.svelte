<script lang="ts">
	import type { PageData } from "../$typess";

	let { data }: { data: PageData } = $props();

	console.log(data);

	function toggleSections(id: string) {
		const sections = document.querySelectorAll<HTMLElement>(
			`[data-id='${id}']`,
		);

		if (sections.length > 0) {
			sections.forEach((s) => {
				console.log(s.style.display);
				s.style.display =
					s.style.display == "none" || s.style.display == ""
						? "block"
						: "none";
			});
		}
	}
</script>

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
			<tr onclick={() => toggleSections(course.id)}>
				<td>{course.subject}{course.number}</td>
				<td class="course-title">{course.title}</td>
				<td>{course.credits}</td>
				<td>{course.attributes}</td>
				<td>{course.sections.length}</td>
			</tr>
			{#if course.sections.length > 0}
			<tr class="sections" data-id={course.id}>
				<td colspan="5">
					<table class="section-table">
						<tbody>
							{#each course.sections as section}
								<tr>
									<td>{section.number}</td>
									<td>{section.instructor}</td>
									<td>{section.location}</td>
									<td>{section.days} {section.times}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</td>
			</tr>
			{/if}
		{/each}
	</tbody>
</table>

<style>
	* {
		font-family: sans-serif;
	}

	.sections {
		display: none;
	}

	table {
		border-collapse: collapse;
		table-layout: fixed;
		width: 60%;
		margin-left: auto;
		margin-right: auto;
	}

	.section-table {
		width: 65rem;
	}

	td {
		padding: 5px;
	}

	thead tr {
		border-bottom: 3px solid black;
	}

	tbody tr {
		border-bottom: 1px solid rgba(0, 0, 0, 0.336);
	}

	.course-title {
		width: 60%;
	}

	.section {
		border: none;
	}
</style>
