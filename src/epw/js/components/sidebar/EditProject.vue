<template>

	<div>

		<edit-details />
		<edit-projection />
		<edit-drivers />
		<edit-policydef />
		<edit-specdes />
		<edit-deployment />
		<edit-delivery />
		<edit-evaluation />
		<edit-user />
		<edit-beneficiary />
		<edit-initiator />


		<edit-services title="External Technical Services" type="extsvc" labelProp="extSvcLabel" />
		<edit-services title="External Organisations" type="extorg" labelProp="extSvcLabel" />
		<edit-services title="Infrastructural Services" type="infsvc" labelProp="extSvcLabel" />

		<edit-social />

	</div>

</template>

<script>

import EditDetails from './edit/Details.vue';
import EditProjection from './edit/Projection.vue';
import EditDrivers from './edit/Drivers.vue';
import EditPolicydef from './edit/PolicyDef.vue';
import EditSpecdes from './edit/SpecDes.vue';
import EditDeployment from './edit/Deployment.vue';
import EditDelivery from './edit/Delivery.vue';
import EditEvaluation from './edit/Evaluation.vue';
import EditUser from './edit/User.vue';
import EditBeneficiary from './edit/Beneficiary.vue';
import EditInitiator from './edit/Initiator.vue';

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
		EditDelivery,
		EditEvaluation,
		EditUser,
		EditBeneficiary,
		EditInitiator,

		EditServices,
		EditSocial,
	},

}
</script>
