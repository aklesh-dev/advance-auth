const expirationTimestamp = Date.now() + 24 * 60 * 60 * 1000;
        console.log('timestamp:',expirationTimestamp); // Outputs a numeric timestamp
        const expirationDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
        console.log('expirationDate:',expirationDate); // Outputs a Date object representing 24 hours in the future
