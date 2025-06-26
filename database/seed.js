const db = require('./db');
const Category = require('../models/Category');
const Device = require('../models/Device');
const Guide = require('../models/Guide');

const seedData = async () => {
  try {
    console.log('Starting database seeding...');
    
    // Wait a bit for database initialization
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Create categories
    const appleCategory = await Category.create('Apple', 'apple');
    const samsungCategory = await Category.create('Samsung', 'samsung');
    const googleCategory = await Category.create('Google', 'google');
    
    console.log('Categories created successfully');

    // Create Apple devices
    const iphone11 = await Device.create('iPhone 11', 'iphone-11', appleCategory.id, 'https://example.com/iphone11.jpg');
    const iphone12 = await Device.create('iPhone 12', 'iphone-12', appleCategory.id, 'https://example.com/iphone12.jpg');
    const iphone13 = await Device.create('iPhone 13', 'iphone-13', appleCategory.id, 'https://example.com/iphone13.jpg');
    const iphone14 = await Device.create('iPhone 14', 'iphone-14', appleCategory.id, 'https://example.com/iphone14.jpg');
    const macbookPro = await Device.create('MacBook Pro', 'macbook-pro', appleCategory.id, 'https://example.com/macbook-pro.jpg');
    const ipad = await Device.create('iPad', 'ipad', appleCategory.id, 'https://example.com/ipad.jpg');

    // Create Samsung devices
    const galaxyS21 = await Device.create('Galaxy S21', 'galaxy-s21', samsungCategory.id, 'https://example.com/galaxy-s21.jpg');
    const galaxyS22 = await Device.create('Galaxy S22', 'galaxy-s22', samsungCategory.id, 'https://example.com/galaxy-s22.jpg');
    const galaxyNote20 = await Device.create('Galaxy Note 20', 'galaxy-note-20', samsungCategory.id, 'https://example.com/galaxy-note-20.jpg');

    // Create Google devices
    const pixel6 = await Device.create('Pixel 6', 'pixel-6', googleCategory.id, 'https://example.com/pixel-6.jpg');
    const pixel7 = await Device.create('Pixel 7', 'pixel-7', googleCategory.id, 'https://example.com/pixel-7.jpg');

    console.log('Devices created successfully');

    // Create guides for iPhone 11
    await Guide.create(
      'iPhone 11 Battery Replacement',
      'iphone-11-battery-replacement',
      iphone11.id,
      'Moderate',
      '30-60 minutes',
      ['Pentalobe Screwdriver', 'Phillips Screwdriver', 'Spudger', 'Suction Handle'],
      ['iPhone 11 Replacement Battery', 'Adhesive Strips'],
      [
        { title: 'Power off your iPhone', description: 'Before beginning, power off your iPhone completely.' },
        { title: 'Remove the pentalobe screws', description: 'Remove the two 6.1 mm-long pentalobe screws at the bottom of the iPhone.' },
        { title: 'Heat the lower edge', description: 'Apply heat to the lower edge of the iPhone to soften the adhesive.' },
        { title: 'Create a gap', description: 'Use a suction handle to create a small gap between the front panel and rear case.' },
        { title: 'Insert spudger', description: 'Insert a spudger into the gap and slide it around the perimeter.' },
        { title: 'Disconnect battery', description: 'Disconnect the battery connector before proceeding.' },
        { title: 'Remove old battery', description: 'Remove the adhesive strips and lift out the old battery.' },
        { title: 'Install new battery', description: 'Place the new battery and connect the battery connector.' },
        { title: 'Reassemble', description: 'Reverse the disassembly steps to reassemble your iPhone.' }
      ]
    );

    await Guide.create(
      'iPhone 11 Screen Replacement',
      'iphone-11-screen-replacement',
      iphone11.id,
      'Difficult',
      '45-90 minutes',
      ['Pentalobe Screwdriver', 'Phillips Screwdriver', 'Spudger', 'Suction Handle', 'Heat Gun'],
      ['iPhone 11 Replacement Screen', 'Adhesive Strips'],
      [
        { title: 'Power off your iPhone', description: 'Before beginning, power off your iPhone completely.' },
        { title: 'Remove the pentalobe screws', description: 'Remove the two 6.1 mm-long pentalobe screws at the bottom of the iPhone.' },
        { title: 'Heat the edges', description: 'Apply heat around the edges of the iPhone to soften the adhesive.' },
        { title: 'Create a gap', description: 'Use a suction handle to create a small gap between the front panel and rear case.' },
        { title: 'Disconnect display cables', description: 'Carefully disconnect all display-related cables.' },
        { title: 'Remove old screen', description: 'Lift out the old screen assembly.' },
        { title: 'Install new screen', description: 'Place the new screen and reconnect all cables.' },
        { title: 'Test functionality', description: 'Test the new screen before final assembly.' },
        { title: 'Reassemble', description: 'Reverse the disassembly steps to reassemble your iPhone.' }
      ]
    );

    // Create guides for iPhone 14
    await Guide.create(
      'iPhone 14 Battery Replacement',
      'iphone-14-battery-replacement',
      iphone14.id,
      'Moderate',
      '30-60 minutes',
      ['Pentalobe Screwdriver', 'Phillips Screwdriver', 'Spudger', 'Suction Handle'],
      ['iPhone 14 Replacement Battery', 'Adhesive Strips'],
      [
        { title: 'Power off your iPhone', description: 'Before beginning, power off your iPhone completely.' },
        { title: 'Remove the pentalobe screws', description: 'Remove the two 6.1 mm-long pentalobe screws at the bottom of the iPhone.' },
        { title: 'Heat the lower edge', description: 'Apply heat to the lower edge of the iPhone to soften the adhesive.' },
        { title: 'Create a gap', description: 'Use a suction handle to create a small gap between the front panel and rear case.' },
        { title: 'Disconnect battery', description: 'Disconnect the battery connector before proceeding.' },
        { title: 'Remove old battery', description: 'Remove the adhesive strips and lift out the old battery.' },
        { title: 'Install new battery', description: 'Place the new battery and connect the battery connector.' },
        { title: 'Reassemble', description: 'Reverse the disassembly steps to reassemble your iPhone.' }
      ]
    );

    await Guide.create(
      'iPhone 14 Screen Replacement',
      'iphone-14-screen-replacement',
      iphone14.id,
      'Difficult',
      '45-90 minutes',
      ['Pentalobe Screwdriver', 'Phillips Screwdriver', 'Spudger', 'Suction Handle', 'Heat Gun'],
      ['iPhone 14 Replacement Screen', 'Adhesive Strips'],
      [
        { title: 'Power off your iPhone', description: 'Before beginning, power off your iPhone completely.' },
        { title: 'Remove the pentalobe screws', description: 'Remove the two 6.1 mm-long pentalobe screws at the bottom of the iPhone.' },
        { title: 'Heat the edges', description: 'Apply heat around the edges of the iPhone to soften the adhesive.' },
        { title: 'Create a gap', description: 'Use a suction handle to create a small gap between the front panel and rear case.' },
        { title: 'Disconnect display cables', description: 'Carefully disconnect all display-related cables.' },
        { title: 'Remove old screen', description: 'Lift out the old screen assembly.' },
        { title: 'Install new screen', description: 'Place the new screen and reconnect all cables.' },
        { title: 'Test functionality', description: 'Test the new screen before final assembly.' },
        { title: 'Reassemble', description: 'Reverse the disassembly steps to reassemble your iPhone.' }
      ]
    );

    // Create guides for MacBook Pro
    await Guide.create(
      'MacBook Pro Battery Replacement',
      'macbook-pro-battery-replacement',
      macbookPro.id,
      'Difficult',
      '60-120 minutes',
      ['P5 Pentalobe Screwdriver', 'T3 Torx Screwdriver', 'Spudger'],
      ['MacBook Pro Replacement Battery'],
      [
        { title: 'Power off your MacBook', description: 'Shut down your MacBook Pro completely.' },
        { title: 'Remove bottom case', description: 'Remove all screws from the bottom case.' },
        { title: 'Disconnect battery', description: 'Disconnect the battery connector.' },
        { title: 'Remove battery screws', description: 'Remove the screws securing the battery.' },
        { title: 'Remove old battery', description: 'Carefully lift out the old battery.' },
        { title: 'Install new battery', description: 'Place the new battery and secure with screws.' },
        { title: 'Reconnect battery', description: 'Reconnect the battery connector.' },
        { title: 'Replace bottom case', description: 'Replace the bottom case and all screws.' }
      ]
    );

    // Create guides for Galaxy S21
    await Guide.create(
      'Galaxy S21 Screen Replacement',
      'galaxy-s21-screen-replacement',
      galaxyS21.id,
      'Difficult',
      '60-90 minutes',
      ['Heat Gun', 'Suction Cup', 'Plastic Opening Tools', 'Phillips Screwdriver'],
      ['Galaxy S21 Replacement Screen', 'Adhesive'],
      [
        { title: 'Power off your phone', description: 'Turn off your Galaxy S21 completely.' },
        { title: 'Heat the back panel', description: 'Apply heat to soften the adhesive on the back panel.' },
        { title: 'Remove back panel', description: 'Carefully remove the back panel using suction cup and opening tools.' },
        { title: 'Disconnect battery', description: 'Disconnect the battery connector.' },
        { title: 'Remove screen assembly', description: 'Disconnect screen cables and remove the screen.' },
        { title: 'Install new screen', description: 'Install the new screen and reconnect all cables.' },
        { title: 'Reassemble', description: 'Reverse the disassembly process.' }
      ]
    );

    // Create guides for Pixel 6
    await Guide.create(
      'Pixel 6 Battery Replacement',
      'pixel-6-battery-replacement',
      pixel6.id,
      'Moderate',
      '45-75 minutes',
      ['Heat Gun', 'Suction Cup', 'Plastic Opening Tools', 'Phillips Screwdriver'],
      ['Pixel 6 Replacement Battery', 'Adhesive Strips'],
      [
        { title: 'Power off your phone', description: 'Turn off your Pixel 6 completely.' },
        { title: 'Heat the back panel', description: 'Apply heat to soften the adhesive on the back panel.' },
        { title: 'Remove back panel', description: 'Carefully remove the back panel.' },
        { title: 'Disconnect battery', description: 'Disconnect the battery connector.' },
        { title: 'Remove old battery', description: 'Remove adhesive strips and lift out the battery.' },
        { title: 'Install new battery', description: 'Place the new battery and reconnect.' },
        { title: 'Reassemble', description: 'Replace the back panel and test.' }
      ]
    );

    console.log('Guides created successfully');
    console.log('Database seeding completed!');
    
    // Close database connection
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err.message);
      } else {
        console.log('Database connection closed.');
      }
    });

  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

// Run the seed function
seedData();

