# Azure deployment plan

## Proposed hosting
- Host the static HTML, CSS and JavaScript app with Azure Static Web Apps.
- The prototype has no server or database requirement; anonymous completed-round results are stored in the user's browser using localStorage.
- No paid AI APIs, credentials or external data services are needed.

## Deployment steps
1. Push the repository to GitHub.
2. Create an Azure Static Web App in the Azure portal and connect the GitHub repository.
3. Set the app location to `/`, API location to blank, and output location to blank because this is a static site without a build step.
4. Review the generated deployment workflow and complete the repository/branch configuration.
5. Open the deployed URL and verify a complete game, restart, adaptive next-round message and JSON export.

## Identity, secrets and security
- The app does not collect names, email addresses or other personal information.
- No secrets are required for local development. If Azure creates a deployment token, keep it in GitHub Actions secrets and never commit it.
- Session history stays in the browser unless the user exports it.

## Monitoring and cost control
- Use Azure Static Web Apps deployment history and GitHub Actions logs to troubleshoot failures.
- The static app has no continuously running compute or database. Select an appropriate Azure plan and verify current pricing/quotas in the Azure portal before deployment.
- Live Azure deployment is optional for this assessment; this documented plan is included as required.
