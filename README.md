# File Converter CLI

This CLI tool allows you to convert various file formats (PDF, PNG, JPEG, JPG, DOCX) using Node.js and the GroupDocs Conversion Cloud API. The tool provides an interactive command-line interface to specify the file location, destination directory, and desired output format. It also includes a spinner animation to indicate the progress of the conversion. It also uses google Cloud storage to store and read files.

## Features

- Convert files between different formats (PDF, PNG, JPEG, JPG, DOCX)
- Interactive command-line interface for user input
- Displays a spinner animation during the conversion process
- Error handling for file operations and API requests

## Prerequisites

- Node.js (v12 or later)
- GroupDocs Conversion Cloud API credentials
- npm (Node Package Manager)

## Installation

1. Clone the repository or download the code.
2. Navigate to the project directory.
3. Install the required dependencies using npm:

    ```sh
    npm install
    ```

4. Create a `.env` file in the root directory of the project and add your GroupDocs Conversion Cloud API credentials:

    ```plaintext
    CLIENT_ID=your_client_id
    CLIENT_SECRET=your_client_secret
    ```

## Usage

1. Make the script executable (if necessary):

    ```sh
    chmod +x index.js
    ```

2. Run the CLI tool:

    ```sh
    ./index.js
    ```

3. Follow the prompts to specify the file location, destination directory, and output format.

## Example

Here's an example of how to use the CLI tool:

```sh
$ cd to project directory
$ run `file-converter`
? Enter the PDF file location: /path/to/your/file.pdf
? Enter the destination directory: /path/to/your/destination
? Please specify the type of file you would like to convert to: (Use arrow keys)
  pdf
  docx

Make sure that the file path is correct before running.
