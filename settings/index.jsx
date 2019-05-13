function mySettings(props) {
  return (
    <Page>
      <Section
        title={<Text bold align="center">Perfect Daily Kickstarter</Text>}>
        <ColorSelect
          settingsKey="color"
          colors={[
            {color: 'black'},
            {color: '#1b2c40'},
            {color: '#394003'},
            {color: '#a51e7c'},
            {color: 'white'},
          ]}
        />
      </Section>
    </Page>
  );
}

registerSettingsPage(mySettings);
