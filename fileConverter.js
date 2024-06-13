#!/usr/bin/env node

import { Poppler } from "node-poppler";
import path from "path";
import fs from "fs";
import inquirer from "inquirer";
import { Command } from "commander";
import dotenv from 'dotenv';
import groupdocs_conversion_cloud from "groupdocs-conversion-cloud";
import ora from "ora";

// Load environment variables from .env file
dotenv.config();


const program = new Command();

const converter = async (file, destination, type) => {
  console.log('secret inside, ' ,process.env.CLIENT_SECRET)
  const spinner = ora('Starting conversion...').start();

  const fileName = 'uploads/' + path.parse(file).name;
  const extension = file.split('.').pop();
  console.log(fileName);
  const config = new groupdocs_conversion_cloud.Configuration(process.env.CLIENT_ID, process.env.CLIENT_SECRET);

  config.apiBaseUrl = "https://api.groupdocs.cloud";
  const myStorage = 'file-converter';

  try {
    // Read the file asynchronously
    const fileStream = await fs.promises.readFile(file);
    spinner.text = 'Uploading file...';

    // Construct FileApi
    const fileApi = groupdocs_conversion_cloud.FileApi.fromConfig(config);

    // Create upload file request
    const uploadRequest = new groupdocs_conversion_cloud.UploadFileRequest(fileName + `.${extension}`, fileStream, myStorage);

    // Upload file
    await fileApi.uploadFile(uploadRequest);
    spinner.text = 'File uploaded successfully! Converting...';

    // Conversion
    try {
      // Initialize API
      const convertApi = groupdocs_conversion_cloud.ConvertApi.fromKeys(process.env.CLIENT_ID, process.env.CLIENT_SECRET);

      // Define convert settings
      const settings = new groupdocs_conversion_cloud.ConvertSettings();
      settings.filePath = fileName + `.${extension}`; // Input file path on the cloud
      settings.format = type; // Output format
      settings.outputPath = "downloads/"; // Output file folder on the cloud
      settings.storageName = myStorage;

      // Create convert document request
      const convertRequest = new groupdocs_conversion_cloud.ConvertDocumentRequest(settings);

      // Convert document
      const result = await convertApi.convertDocument(convertRequest);
      spinner.text = 'Document converted successfully! Downloading...';

      // Download
      try {
        console.log('downloads/' + path.parse(file).name + '.' + type);
        // Create download file request
        const downloadRequest = new groupdocs_conversion_cloud.DownloadFileRequest('downloads/' + path.parse(file).name + '.' + type, myStorage);

        // Download file
        const response = await fileApi.downloadFile(downloadRequest);

        // Save file in your working directory
        await fs.promises.writeFile(`${destination}/` + path.parse(file).name + '.' + type, response, "binary");
        spinner.succeed("File saved successfully!");
      } catch (error) {
        spinner.fail("Error downloading file:");
        console.error(error);
      }
    } catch (error) {
      spinner.fail("Error converting document:");
      console.error(error);
    }
  } catch (error) {
    spinner.fail("Error uploading file:");
    console.error(error);
    if (error.message === 'invalid_client') {
      console.error('Invalid client credentials. Please check your CLIENT_ID and CLIENT_SECRET.');
    }
  }
};

// converter('C:/Users/kevin/Downloads/Untitled design.png', 'D:\File_conversion', 'jpg');

// Define CLI options and arguments
program
  .version('1.0.0')
  .description('Convert PDF to PNG')
  .action(async () => {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'file',
        message: 'Enter the PDF file location:',
      },
      {
        type: 'input',
        name: 'destination',
        message: 'Enter the destination directory:',
      },
      {
        type: 'list',
        name: 'type',
        message: 'Please specify the type of file you would like to convert to:',
        choices: ['pdf', 'docx', 'png', 'jpeg', 'jpg']
      }
    ]);

    await converter(answers.file, answers.destination, answers.type);
  });

// Parse command-line arguments
program.parse(process.argv);

