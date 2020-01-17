<template>

	<div>

		<edit-details/>
		<edit-projection/>
		<edit-beneficiary/>
		<edit-services/>
		<!-- <h3 class="sidebar-heading">Goals and Targets</h3>
		<h3 class="sidebar-heading">Initiators</h3>
		<h3 class="sidebar-heading">Services</h3>
		<h3 class="sidebar-heading">Social Media</h3> -->

	</div>

</template>

<script>

import EditDetails from './edit/Details.vue';
import EditProjection from './edit/Projection.vue';
import EditServices from './edit/Services.vue';
import EditBeneficiary from './edit/Beneficiary.vue';

export default {

	components: {
		EditDetails,
		EditProjection,
		EditServices,
		EditBeneficiary,
	},

}
</script>
