const pokemon = require('pokemon');
const fs	  = require('fs');
const path 	  = require('path');

// Replace these with the appropriate folder names
const source = 'animated-by-name/';
const dest   = 'animated-by-nationaldex/';

const capitalize = (string) => {
	return string.charAt(0).toUpperCase() + string.substr(1).toLowerCase();
}

// For the 16 Pokemon that are nammed differently
const fixMapping = (originalName) => {
	const mappingFix = {
		'Nidoran-f': 'Nidoran♀',
		'Nidoran': 'Nidoran♂',
		'Farfetchd': 'Farfetch’d',
		'Mrmime': 'Mr. Mime',
		'Hooh': 'Ho-Oh',
		'Mimejr': 'Mime Jr.',
		'Porygon-z': 'Porygon-Z',
		'Zekrom': 'Zekrom ',
		'Typenull': 'Type: Null',
		'Jangmoo': 'Jangmo-o',
		'Hakamoo': 'Hakamo-o',
		'Kommoo': 'Kommo-o',
		'Tapukoko': 'Tapu Koko',
		'Tapulele': 'Tapu Lele',
		'Tapubulu': 'Tapu Bulu',
		'Tapufini': 'Tapu Fini'
	}

	return mappingFix[originalName] ? mappingFix[originalName] : originalName;
}

// Rename the Pokemon Sprites from Name to National Dex Number
fs.readdir( source, ( err, files ) => {
	if( err ) {
		console.error( "Could not list the directory.", err );
		process.exit( 1 );
	} 

	files.forEach( ( file, index ) => {
		let sourcePath = path.join( source, file );

		fs.stat( sourcePath, ( error, stat ) => {
			if ( error ) {
				console.error( "Error stating file.", error );
				return;
			}

			const fileExtension = path.extname(sourcePath);
			const pokemonName = path.basename(sourcePath, fileExtension);
			let pokemonNumber = 0;

			try {
				pokemonNumber = pokemon.getId(fixMapping(capitalize(pokemonName)));
			} catch (err) {
				// console.error(err);
			} finally {
				if (pokemonNumber === 0) {
					console.log( "Skipping", pokemonName )
					// Don't rename or move the Pokemon if no ID is found
				} else {
					let destPath = path.join( dest, pokemonNumber.toString() + fileExtension );

					fs.rename( sourcePath, destPath, ( error ) => {
						if ( error ) {
							console.error( "File moving error.", error );
						}
						else {
							console.log( "Moved file '%s' to '%s'.", sourcePath, destPath );
						}
					});
				}
			}
		});    
	});

	// Find missing Pokemon (Displays on second run of script after initial batch rename)
	fs.readdir( dest, ( err, files ) => {
		if( err ) {
			console.error( "Could not list the directory.", err );
			process.exit( 1 );
		} 

		let allMovedFiles = [];
		files.forEach( ( file, index ) => {
			let finalDestPath = path.join( source, file );
			const destExtension = path.extname(finalDestPath);
			allMovedFiles.push(parseInt(path.basename(finalDestPath, destExtension)))
		});    
		allMovedFiles.sort((a, b) => a - b)
		
		let currentPokemon = 0;
		for(let nationalDexNum = 1; nationalDexNum <= allMovedFiles.length; nationalDexNum++) {
			if (allMovedFiles[currentPokemon] !== nationalDexNum) {
				console.log("Missing", nationalDexNum);
				currentPokemon--;
			}
			currentPokemon++;
		}
	});
});






