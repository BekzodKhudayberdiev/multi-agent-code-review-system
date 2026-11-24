import * as fs from 'fs';
import * as path from 'path';
import { CodeReviewOrchestrator } from './src/orchestrator.js';
import { ReportGenerator } from './src/utils/report-generator.js';

async function generateReports() {
  const prs = [
    { owner: 'udacity', repo: 'cd14715-simple-todo-app', number: 1 },
    { owner: 'udacity', repo: 'cd14715-simple-todo-app', number: 2 },
    { owner: 'udacity', repo: 'cd14715-simple-todo-app', number: 3 }
  ];

  const reportsDir = path.join(process.cwd(), 'reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  const orchestrator = new CodeReviewOrchestrator();
  const generator = new ReportGenerator();

  for (const pr of prs) {
    console.log(`\n📋 Generating reports for ${pr.owner}/${pr.repo}#${pr.number}...`);

    try {
      const report = await orchestrator.reviewPullRequest(pr.owner, pr.repo, pr.number);

      const filename = `${pr.owner}_${pr.repo}_${pr.number}`;

      // JSON
      const json = generator.generateJSONReport(report);
      const jsonPath = path.join(reportsDir, `${filename}.json`);
      fs.writeFileSync(jsonPath, json);
      console.log(`  ✅ JSON: ${filename}.json`);

      // Markdown
      const md = generator.generateMarkdownReport(report);
      const mdPath = path.join(reportsDir, `${filename}.md`);
      fs.writeFileSync(mdPath, md);
      console.log(`  ✅ Markdown: ${filename}.md`);

      // HTML
      const html = generator.generateHTMLReport(report);
      const htmlPath = path.join(reportsDir, `${filename}.html`);
      fs.writeFileSync(htmlPath, html);
      console.log(`  ✅ HTML: ${filename}.html`);

      console.log(`  📊 Score: ${report.summary.overallScore}/100`);
    } catch (error) {
      console.error(`  ❌ Failed:`, error instanceof Error ? error.message : String(error));
    }
  }

  console.log(`\n✨ All reports generated in ${reportsDir}`);
  const files = fs.readdirSync(reportsDir);
  console.log(`📁 Generated files: ${files.length}`);
  files.forEach(f => console.log(`   - ${f}`));
}

generateReports().catch(console.error);
