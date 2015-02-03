var React = require('react/addons'),
    App = require('./components/app');

document.addEventListener('DOMContentLoaded', function() {
    console.log('awks');
    React.render(
        <App />,
        document.body
    )
});