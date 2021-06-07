// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
const _ = require('lodash');

let blogfolder = 'src';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "gatsbyblogpost" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('gatsbyblogpost.createMarkdownPost', function () {
		// The code you place here will be executed every time your command is executed

		// We start the process here
		startInputProcess();
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}

function startInputProcess() {
	vscode.window.showInputBox({
		value: '',
		placeHolder: 'Enter Your Title Here'
	}).then(result => { 
		//vscode.window.showInformationMessage(`Got: ${result}`);
		createMarkdownFolder(result);
	}).catch(err => console.log(err));
}

function createMarkdownFolder(input) {

	let folderPaths = vscode.workspace.workspaceFolders;
	const allWorkspaceolders = folderPaths.map(folder => {
		return folder.uri.path;
	});

	if (allWorkspaceolders.length > 0) {
		const myConfig = vscode.workspace.getConfiguration('gatsbyblogpost');
		const subfolder = myConfig.blogSourcePath || blogfolder;
		const currDate = getDateString();
		const title = input || 'Your Title Here';
		const folderPath = path.join(allWorkspaceolders[0], subfolder, currDate);
		let markdownFilename = 'index.md';
	
		if (!fs.existsSync(folderPath)) {
			fs.mkdirSync(folderPath);
		}
		
		if (title !== 'Your Title Here') {
			markdownFilename = _.kebabCase(title) + '.md';
		}
	
		const frontmatter = `---
layout: post
title: "${title}"
description: ""
category: 
date: ${currDate}
cover_image: "./unnamed.jpg"
---
`;
	
		const markdownPath = path.join(folderPath, markdownFilename);
		createMarkdownFile(markdownPath, frontmatter);
		vscode.window.showInformationMessage(`Created a COOL post gatsbyblogpost at ${markdownFilename} in ${subfolder}`);
	} else {
		vscode.window.showErrorMessage('Must have a workspace folder selected');	
	}
}

function getDateString() {
	const currDate = new Date();
	const month = currDate.getMonth() + 1;
	const date = currDate.getDate();
	const year = currDate.getFullYear(); 
	const formattedDate = `${year}-${addLeadingZeros(month)}-${addLeadingZeros(date)}`;
	return formattedDate;
}

function addLeadingZeros(n) {
	if (n <= 9) {
	  return "0" + n;
	}
	return n
}

function createMarkdownFile(mdp, frontmatter) {
	if (!fs.existsSync(mdp)) {
		fs.writeFileSync(mdp, frontmatter);
	} else {
		vscode.window.showErrorMessage(`This file ${mdp} already exists.`);
	}
}
