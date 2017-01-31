module.exports = {
    secret: 'OPF:sM{R9AQTZ051v5odT3X`%h+hRe',
    database: {
        persist: 'mysql://127.0.0.1:3306/Kokoto',
        cache: 'redis://127.0.0.1:6379/0'
    },
	site: {
		name: 'Project'
	},
    listen: 8080
};