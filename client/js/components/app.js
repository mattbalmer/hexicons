var React = require('react/addons'),
    Form = require('./form');

module.exports = App = React.createClass({
    getInitialState: function() {
        return {
            expanded: false
        }
    },
    handleSubmit: function() {
        this.setState({ loading: true });
    },
    handleError: function() {
        this.setState({ loading: false });
    },
    handleIcon: function() {
        this.setState({ expanded: true, loading: false });
    },
    render: function() {
        var cx = React.addons.classSet,
            mainClasses = cx({
                main: true,
                expanded: this.state.expanded,
                loading: this.state.loading
            });

        return (
            <div className='app'>
                <header className='header'>
                    <div className='hexagon-inner'>
                        <h1>HexIcons</h1>
                        <h2>Create honeycomb icons from PNG transparencies</h2>
                    </div>
                </header>
                <main className={mainClasses}>
                    <div className='hexagon-inner'>
                        <Form onSubmit={this.handleSubmit} onIcon={this.handleIcon} onError={this.handleError}/>
                        <div className='loader-container'><div className='loader'></div></div>
                    </div>
                </main>
            </div>
        )
    }
});