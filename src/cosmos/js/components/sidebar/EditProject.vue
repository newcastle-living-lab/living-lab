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


		<edit-services
			title="External Technical Services"
			type="extsvc"
			labelProp="extSvcLabel"
			hintMain="What reusable facilities, (technical and human) resources, services and sources of information were developed and used in support of these service definition and development processes? What external resources and services (e.g. communications and social media) were/are used?"
		/>

		<edit-services
			title="External Organisations"
			type="extorg"
			labelProp="extOrgLabel"
			hintMain="Are there any relevant actors, stakeholders or agencies which are relevant to the pilot, but which remain outside its vision and ethos?"
		/>

		<edit-services
			title="Infrastructural Services"
			type="infsvc"
			labelProp="infSvcLabel"
			hintMain="What external services, channels and facilities do you make use of in the delivery of your service(s)? What information sources do you make use of? What information do you publish, to whom and using what channels and media?"
		/>

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
