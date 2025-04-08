import dns from "dns/promises";

(async () => {
  const dnsLookupResult = await dns.lookup("meta.com");
  const reverseLookupResult = await dns.reverse(dnsLookupResult.address);
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
  const dnsServers = dns.getServers();
  const service = await dns.lookupService("127.0.0.1", 22);

  console.log({ dnsLookupResult, reverseLookupResult, dnsServers, service });
})();
