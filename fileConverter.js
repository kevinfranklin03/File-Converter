#!/usr/bin/env node

import { Poppler } from "node-poppler";
import path from "path";
import fs from "fs";
import inquirer from "inquirer";
import { Command } from "commander";

const poppler = new Poppler();
const program = new Command();

// Simple spinner animation
const showSpinner = () => {
  const spinnerFrames = ['-', '\\', '|', '/'];
  let i = 0;
  return setInterval(() => {
    process.stdout.write(`\r${spinnerFrames[i]} Converting...`);
    i = (i + 1) % spinnerFrames.length;
  }, 100);
};


// converter() is a common function
// takes two argument -> file(file Location) || destination
// Identify the File Type
// Classify the conversion based on the file type


const converter = async (file, destination) => {

  const fileType = file.split('.').pop();
  console.log(fileType)

  // console.log("file length ", file.length)
  // console.log("destination ", destination.length)

  // Validation for file and destination
  if(!(file.length || destination.length === 0) ) console.error("Please enter a valid file location or destination!")
  
  const spinner = showSpinner(); // Start the spinner animation

    
/* ------------------------------------ PDF Conversion -------------------------------------------- */

// PDF to PNG
    try {
      const options = {
        pngFile: true,
      };
  
      const fileName = path.parse(file).name;
      const outputFileDestination = path.join(destination, fileName);
  
      // Ensure the destination directory exists
      if (!fs.existsSync(destination)) {
        fs.mkdirSync(destination, { recursive: true });
      }
  
      const res = await poppler.pdfToCairo(file, outputFileDestination, options);
      clearInterval(spinner); // Stop the spinner animation
      console.log("\rConversion successful:", res);
    } catch (error) {
      clearInterval(spinner); // Stop the spinner animation
      console.error("\rError during conversion:", error);
    }
  
};

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
    ]);

    await converter(answers.file, answers.destination);
  });

// Parse command-line arguments
program.parse(process.argv);
