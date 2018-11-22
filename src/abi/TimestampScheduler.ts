export default [{"constant":false,"inputs":[{"name":"_toAddress","type":"address"},{"name":"_callData","type":"bytes"},{"name":"_uintArgs","type":"uint256[8]"}],"name":"schedule","outputs":[{"name":"newRequest","type":"address"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"temporalUnit","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"feeRecipient","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_bounty","type":"uint256"},{"name":"_fee","type":"uint256"},{"name":"_callGas","type":"uint256"},{"name":"_callValue","type":"uint256"},{"name":"_gasPrice","type":"uint256"}],"name":"computeEndowment","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"factoryAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_factoryAddress","type":"address"},{"name":"_feeRecipient","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"request","type":"address"}],"name":"NewRequest","type":"event"}]
