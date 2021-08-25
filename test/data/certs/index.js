const
    {readFileSync}   = require('fs'),
    {join: joinPath} = require('path'),
    load             = (filename) => readFileSync(joinPath(__dirname, filename));

exports.server_1 = {
    private: load('server_1.key'),
    public:  load('server_1.key.pub')
};

exports.server_2 = {
    private: load('server_2.key'),
    public:  load('server_2.key.pub')
};

exports.client_1 = {
    private: load('client_1.key'),
    public:  load('client_1.key.pub')
};

exports.client_2 = {
    private: load('client_2.key'),
    public:  load('client_2.key.pub')
};
