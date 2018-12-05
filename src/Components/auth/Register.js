import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { firebaseConnect } from 'react-redux-firebase';
import { notifyUser } from '../../actions/notifyActions';
import Alert from '../layout/Alert';

class Register extends Component {
  state = {
    email: '',
    password: ''
  };

  componentWillMount() {
    const { allowRegistration } = this.props.settings;

    if(!allowRegistration) {
      this.props.history.push('/');
    }
  }

  // reset error fields via dispatch call if message (from notifyUser) exists.
  // This will remove error message in DOM for logout --> login
  componentWillUnmount() {
    const { message } = this.props.notify;
    const { notifyUser } = this.props;
    {
      message && notifyUser(null, null);
    }
  }

  onSubmit = e => {
    e.preventDefault();

    const { firebase, notifyUser } = this.props;
    const { email, password } = this.state;

    // Register with firebase
    firebase
      .createUser({ email, password })
      .catch(err => notifyUser('That user Already Exists', 'error'));
  };

  onChange = e => this.setState({ [e.target.name]: e.target.value });

  render() {
    // pull message and messageType from notify (retrieved from mapStateToprops)
    const { message, messageType } = this.props.notify;
    return (
      <div className="row">
        <div className="col-md-6 mx-auto">
          <div className="card card-body">
            {message && <Alert message={message} messageType={messageType} />}
            <h1 className="text-center pb-4 pt-3">
              <span className="text-primary">
                <i className="fas fa-lock" /> Register
              </span>
            </h1>
            <form onSubmit={this.onSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="text"
                  className="form-control"
                  name="email"
                  required
                  value={this.state.email}
                  onChange={this.onChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  required
                  value={this.state.password}
                  onChange={this.onChange}
                />
              </div>
              <input
                type="submit"
                value="Register"
                className="btn btn-primary btn-block"
              />
            </form>
          </div>
        </div>
      </div>
    );
  }
}

Register.propTypes = {
  firebase: PropTypes.object.isRequired,
  notify: PropTypes.object.isRequired,
  notifyUser: PropTypes.object.isRequired
};

export default compose(
  firebaseConnect(),
  connect(
    (state, props) => ({
      notify: state.notify,
      settings: state.settings
    }),
    { notifyUser }
  )
)(Register);
