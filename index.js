import fs from 'fs';
import checkRepo from './checkRepo.js';
import checkPushRepo from './checkPushRepo.js';

const CONF_FILE = 'repos.js';

if(!fs.existsSync(CONF_FILE)) {
	fs.writeFileSync(CONF_FILE, 'export default {\n\tpaths: [\n\t\t// \'/path/to/project\',\n\t]\n};');
}

import config from './repos.js';

const args = process.argv;
const update_all = args.includes('-y');

if(update_all) {
	console.log('Running with update_all');
}

const main = async () => {
	const with_changes = [];
	const sorted = config.paths.sort((a, b) => ('' + a).localeCompare(b));
	for(const path of sorted) {
		const changes = await checkRepo(path);
		if(changes) {
			with_changes.push(path);
		}
	}

	for(const path of with_changes) {
		await checkPushRepo(path, update_all);
	}
}

main();