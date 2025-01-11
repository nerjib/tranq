// Libraries
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Custom Components
;

// Layout
import { AppMainContent } from '../shared/Layout';
import Form from '../../containers/form';
import Invoice from '../../containers/invoice';
import Contacts from '../../containers/contacts';
import Settings from '../../containers/settings';

class AppMain extends Component {
  shouldComponentUpdate(nextProps) {
    return this.props.activeTab !== nextProps.activeTab;
  }

  render() {
    const { activeTab } = this.props;
    return (
      <AppMainContent>
        {activeTab === 'form' && <Form />}
        {activeTab === 'invoices' && <Invoice />}
        {activeTab === 'contacts' && <Contacts />}
        {activeTab === 'settings' && <Settings />}
      </AppMainContent>
    );
  }
}

AppMain.propTypes = {
  activeTab: PropTypes.string.isRequired,
};

export default AppMain;
