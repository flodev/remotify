import dns from 'dns';
const options = {
  family: 6,
  all: true,
  hints: dns.ADDRCONFIG | dns.V4MAPPED,
};
dns.lookup('postgresql:5432', options, (err, address, family) =>
  console.log('address: %j family: IPv%s', address, family),
);
dns.lookup('hasura', options, (err, address, family) =>
  console.log('address: %j family: IPv%s', address, family),
);
dns.lookup('google.com', options, (err, address, family) =>
  console.log('address: %j family: IPv%s', address, family),
);
