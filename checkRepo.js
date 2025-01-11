import { exec } from 'child_process';
import chalk from 'chalk';

const repoHasChanges = (path) => {
	return new Promise((resolve, reject) => {
		exec('cd '+path+'; git status --porcelain', (error, stdout, stderr) => {
			resolve(!!stdout);
		});
	});
}

const repoBranch = (path) => {
	return new Promise((resolve, reject) => {
		exec('cd '+path+'; git symbolic-ref --short HEAD', (error, stdout, stderr) => {
			resolve(stdout.trim());
		});
	});
}

const getRepoText = async (path) => {
	const branch = await repoBranch(path);

	return (chalk.greenBright(path.split('/').pop()) + ':' + chalk.gray(branch)).padEnd('55', ' ');
}

const getRepoStatusText = async (path) => {
	const changes = await repoHasChanges(path);

	if(changes) {
		return chalk.redBright('CHANGES');
	} else {
		return chalk.blueBright('OK');
	}
}

export default async (path) => {
	const changes = await repoHasChanges(path);

	console.log((await getRepoText(path)) + (await getRepoStatusText(path)));

	return changes;
}