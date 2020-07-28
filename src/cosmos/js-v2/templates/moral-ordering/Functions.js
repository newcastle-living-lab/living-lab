
export default {

	/**
	 * Determine the visibility status (true/false) based on the definition and project data.
	 */
	graphicVisibility(definitionName, projectData) {

		if (definitionName === '_redRect') {
			var hasEthos = projectData.defineEthos
				&& projectData.defineEthos.definedBy
				&& projectData.defineEthos.evidenceUrl
			// return (hasEthos ? true : false);
			return true;
		}

		if (definitionName === '_governLabel') {
			var hasGovern = projectData.govern.actions
				&& projectData.govern.actors.length > 0
				&& projectData.govern.outcomes
				&& projectData.govern.evolution
				&& projectData.govern.improvements;
			return (hasGovern ? true : false);
		}

		if (definitionName === '_deliverLabel') {
			var hasDeliver = projectData.deliver.method
				&& projectData.deliver.actors.length > 0
				&& projectData.deliver.evidenceUrl
			return (hasDeliver ? true : false);
		}

		if (definitionName === '_ethosSection') {
			var hasEthos = projectData.defineEthos.values
				&& projectData.defineEthos.definedBy
				&& projectData.defineEthos.evidenceUrl
			return (hasEthos ? true : false);
		}

		if (definitionName === '_planManageSection') {
			var hasPlanManagePrior = projectData.planManagePrior.actions
				&& projectData.planManagePrior.actors.length > 0
				&& projectData.planManagePrior.evidenceUrl;
			var hasPlanManageCurrent = projectData.planManageCurrent.actions
				&& projectData.planManageCurrent.actors.length > 0
				&& projectData.planManageCurrent.evidenceUrl;
			return (hasPlanManagePrior && hasPlanManageCurrent ? true : false);
		}

		return false;
	}

}
