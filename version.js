import { execSync } from 'node:child_process'
import fs from 'node:fs'

const PACKAGE_PATH = './package.json'

try {
	const diff = execSync('git diff --cached package.json', { encoding: 'utf8' })

	const versionChanged = /"version"\s*:\s*"/.test(diff)

	if (versionChanged) {
		console.log('✅ Version manually changed. Skipping auto-bump.')
		process.exit(0)
	}

	const pkg = JSON.parse(fs.readFileSync(PACKAGE_PATH, 'utf8'))
	const [major, minor] = pkg.version.split('.').map(Number)

	const newVersion = `${major}.${minor + 1}.0`
	pkg.version = newVersion

	fs.writeFileSync(PACKAGE_PATH, `${JSON.stringify(pkg, null, 2)}\n`)

	execSync('git add package.json')

	console.log(`📦 Auto-bumped version to ${newVersion}`)
} catch (err) {
	console.error('❌ Error auto-bumping version:', err.message)
	process.exit(1)
}
