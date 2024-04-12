import { Tabs, Tab, Container, TabList, TabPanels, TabPanel } from '@chakra-ui/react';
import AllCourses from '../../components/allcourses/AllCourses';
import StudentCourses from './StudentCourses';

const StudentHome = () => {
  return (
    <>
      <Container shadow='xs' bg='#fff' mt='1px'>
        <Tabs isFitted variant='enclosed' isLazy colorScheme='green'>
          <TabList>
            <Tab>All courses</Tab>
            <Tab>My courses</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <AllCourses />
            </TabPanel>
            <TabPanel>
              <StudentCourses />
            </TabPanel>

          </TabPanels>
        </Tabs>
      </Container>
    </>
  )
}

export default StudentHome
