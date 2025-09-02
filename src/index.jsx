// Minimal resolver function to satisfy manifest handler requirement
export const handler = async (event, context) => {
	return { status: 200, body: { ok: true } };
};

// Rovo action: outageSearch
export const outageSearch = async (payload) => {
	// payload.inputs.query contains user message when invoked by the Agent
	const q = payload?.inputs?.query || '';
	const normalized = String(q).trim();
	if (!normalized) {
		return 'Please provide a short question, for example: "Show major outages in NSW identified today"';
	}
	// This is a placeholder; normally you would call Jira APIs or storage.
	// Keep it Runs on Atlassian eligible: no external fetch, no egress.
	const example = [
		{
			incidentId: 'IM1830485',
			severity: 'Major',
			location: 'Parramatta, NSW',
			identified: '6 hours ago',
		},
		{
			incidentId: 'IM2047001',
			severity: 'Significant',
			location: 'Sydney CBD, NSW',
			identified: '2 hours ago',
		},
	];
	return (
		`Here are two sample results for: "${normalized}"\n` +
		example
			.map(
				(e) =>
					`• ${e.incidentId} — ${e.severity} — ${e.location} — identified ${e.identified}`
			)
			.join('\n')
		);
};
