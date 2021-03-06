/**
 * FundingProposalController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var _ = require('lodash');
module.exports = {

  friendlyName: 'Submission from the form page to the FundingProposal endpoint',

  inputs: {

    projectName: {
      type: 'string'
    },
    startDate: {
      type: 'string'
    },
    hashtag: {
      type: 'string'
    },
    bcfName: {
      type: 'string'
    },
    stakeholders: {
      type: 'string'
    },
    projectSummary: {
      type: 'string'
    },
    resources: {
      type: 'string'
    },
    budget: {
      type: 'string'
    },
    timeline: {
      type: 'string'
    },
    goals: {
      type: 'string'
    },
    other: {
      type: 'string'
    }

  },

  exits: {

    success: {

      viewTemplatePath: '/account/all-fpr-forms'

    }

  },

  fn: async function (inputs, exits)  {

    // Fetch all forms belonging to this user.
    var userForms = ( await FundingProposal.find({ user: this.req.me.id }) || [] );

    // For all 'listed' FPRs, compose a link to their
    // location on the Github master repo.
    userForms = userForms.map( (oneUserForm) => {
      var formattedFprId = oneUserForm.fprId;
      if (oneUserForm.status === 'listed') {
        formattedFprId = ''+formattedFprId;
        while (formattedFprId.length < 4) {
          formattedFprId = '0'+formattedFprId;
        }
        oneUserForm.githubLink = 'https://github.com/The-Bitcoin-Cash-Fund/FPR/blob/master/FPR-'+formattedFprId+'.md';
      }

      return oneUserForm;

    });

    // Check if the owner has an existing fork of the `FPR` repo
    // so we can warn them that it will be deleted
    var githubAccountIsDirty = await sails.hooks.github.checkForExistingRepoFork({ id: this.req.session.userId });

    return this.res.view('pages/account/all-fpr-forms', {
      submissionWarning: githubAccountIsDirty ? 'Your Github account already has a fork of the <code>The-Bitcoin-Cash-Fund/FPR</code> repo.  Please backup that work immediately.  When your new project is listed by the admins, YOUR WORK IN THAT REPO WILL BE DELETED ON GITHUB!!' : undefined,
      forms: _.groupBy(userForms, 'status')
    });
  }

};
