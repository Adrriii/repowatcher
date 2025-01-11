import { exec } from 'child_process';
import chalk from 'chalk';
import readline from 'node:readline';

const repoBranch = (path) => {
	return new Promise((resolve, reject) => {
		exec('cd '+path+'; git symbolic-ref --short HEAD', (error, stdout, stderr) => {
			resolve(stdout.trim());
		});
	});
}

const getRepoText = async (path) => {
	const branch = await repoBranch(path);

	return (chalk.greenBright(path.split('/').pop()) + ':' + chalk.gray(branch));
}

const pushChanges = async (path) => {
	return new Promise((resolve, reject) => {
		exec('cd '+path+'; git add .; git commit -am "repowatcher: push latest changes"; git push', (error, stdout, stderr) => {
			if(error) {
				reject(error);
				return
			}
			resolve();
		});
	});
}

export default async (path, force) => {
	return new Promise(async (resolve, reject) => {
		if(!force) {
			const read = readline.createInterface({
				input: process.stdin,
				output: process.stdout,
			});
			
			read.question('Push changes to '+(await getRepoText(path))+' ? [Y/n] ', async (response) => {
				read.close();
				const choice = response.toLowerCase();
				const push = choice !== 'n' && choice !== 'no';
				if(push) {
					console.log('Pushing changes to '+(await getRepoText(path)));
					await pushChanges(path);
				}
				resolve();
			});
		} else {
			console.log('Pushing changes to '+(await getRepoText(path)));
			await pushChanges(path);
			resolve();
		}
	});
}