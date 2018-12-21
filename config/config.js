const secdata = {};

secdata.mail_id = 'elevenx099@gmail.com';
secdata.geo_path = 'http://localhost:8081/geoserver/rest/workspaces/AeroGMS/datastores/aeroGMS/featuretypes';
secdata.geo_host = 'localhost';
secdata.geo_port = '8081';
secdata.geo_del = 'http://localhost:8081/geoserver/rest/layers';
secdata.ser_port = '3001';
secdata.pghost = 'localhost';

secdata.mseva={};
secdata.mseva.header = { 
    dnt: '1',
    authority: 'mseva-uat.lgpunjab.gov.in',
    referer: 'https://mseva-uat.lgpunjab.gov.in/employee/user/login',
    accept: 'application/json, text/plain, */*',
    'content-type': 'application/x-www-form-urlencoded',
    authorization: 'Basic ZWdvdi11c2VyLWNsaWVudDplZ292LXVzZXItc2VjcmV0',
    'accept-language': 'en-US,en;q=0.9',
    origin: 'https://mseva-uat.lgpunjab.gov.in' };

secdata.mseva.formdata = { 
    username: 'PTEMP03',
    password: '9417080618',
    grant_type: 'password',
    scope: 'read',
    tenantId: 'pb.sangatmandi',
    userType: 'EMPLOYEE',
    undefined: undefined };

secdata.mseva.headers = { 
    dnt: '1',
    authority: 'mseva-uat.lgpunjab.gov.in',
    referer: 'https://mseva-uat.lgpunjab.gov.in/employee/property-tax/property/PT-319-005728/pb.sangatmandi',
    accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36',
    'accept-language': 'en-US,en;q=0.9',
    origin: 'https://mseva-uat.lgpunjab.gov.in'}

secdata.mseva.headersp = {  dnt: '1',
    authority: 'mseva-uat.lgpunjab.gov.in',
    referer: 'https://mseva-uat.lgpunjab.gov.in/employee/property-tax/search-property',
    accept: 'application/json, text/plain, */*',
    'content-type': 'application/json;charset=UTF-8',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36',
    'accept-language': 'en-US,en;q=0.9',
    origin: 'https://mseva-uat.lgpunjab.gov.in' }

secdata.mseva.authurl = 'https://mseva-uat.lgpunjab.gov.in/user/oauth/token';
secdata.mseva.receipturl = 'https://mseva-uat.lgpunjab.gov.in/collection-services/receipts/_search';
secdata.mseva.propsurl = 'https://mseva-uat.lgpunjab.gov.in/pt-services-v2/property/_search';

// secdata.mail_id = 'elevenx099@gmail.com';
// secdata.geo_path = 'http://122.176.113.56:8081/geoserver/rest/workspaces/AeroGMS/datastores/aeroGMS/featuretypes';
// secdata.geo_host = '122.176.113.56';
// secdata.geo_port = '8081';
// secdata.geo_del = 'http://122.176.113.56:8081/geoserver/rest/layers';
// secdata.ser_port = '3001';
// secdata.pghost = '122.176.113.56';

module.exports.secdata = secdata;
