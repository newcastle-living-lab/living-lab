<template>

	<div>

		<edit-details />
		<edit-projection />
		<edit-drivers />
		<edit-policydef />
		<edit-specdes />
		<edit-deployment />


		<!-- <edit-beneficiary /> -->
		<edit-services />
		<edit-social />
		<!-- <h3 class="sidebar-heading">Goals and Targets</h3>
		<h3 class="sidebar-heading">Initiators</h3>
		<h3 class="sidebar-heading">Services</h3>
		<h3 class="sidebar-heading">Social Media</h3> -->

	</div>

</template>

<script>

import EditDetails from './edit/Details.vue';
import EditProjection from './edit/Projection.vue';
import EditDrivers from './edit/Drivers.vue';
import EditPolicydef from './edit/PolicyDef.vue';
import EditSpecdes from './edit/SpecDes.vue';
import EditDeployment from './edit/Deployment.vue';

import EditBeneficiary from './edit/Beneficiary.vue';
import EditServices from './edit/Services.vue';
import EditSocial from './edit/Social.vue';

export default {

	components: {
		EditDetails,
		EditProjection,
		EditDrivers,
		EditPolicydef,
		EditSpecdes,
		EditDeployment,

		EditBeneficiary,
		EditServices,
		EditSocial,
	},

}
</script>
