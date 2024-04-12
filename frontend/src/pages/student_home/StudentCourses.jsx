import { Box, useToast, Stack, Card, Link, Flex, Heading, CardBody, StackDivider, Text, Button } from '@chakra-ui/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { FileEarmarkPdfFill } from 'react-bootstrap-icons';


const StudentCourses = () => {
  const toast = useToast();
  const [courses, setCourses] = useState([]);
  console.log('courses: ', courses);
  const [studentData, setStudentData] = useState([]);

  const handleEnroll = async (id) => {
    try {
      await axios({
        method: 'POST',
        url: '/courses/enrollcourse',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        data: {
          courseid: id
        }
      });

      getAllCourses();
      localStorage.getItem("role") === "student" && getStudent();

      toast({
        position: 'top',
        title: "Course enrolled successfully",
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        position: 'top',
        title: error.response.data.error,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }

  const handleDisenroll = async (id) => {
    try {
      await axios({
        method: 'POST',
        url: '/courses/disenrollcourse',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        data: {
          courseid: id
        }
      });

      getAllCourses();
      localStorage.getItem("role") === "student" && getStudent();

      toast({
        position: 'top',
        title: "Course disenrolled successfully",
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        position: 'top',
        title: error.response.data.error,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }

  const getStudent = async () => {
    try {
      const response = await axios({
        method: 'GET',
        url: 'courses/getstudentenrolledcourses',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });
      if (response.data.enrolledCourses) {
        setStudentData(response.data.enrolledCourses.courses);
      }
    } catch (error) {
      toast({
        position: 'top',
        title: error.response.data.error,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }

  const getAllCourses = async () => {
    try {
      const response = await axios({
        method: 'GET',
        url: 'courses/showenrollcourse',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });
      if (response.data.enrolledCourses) {
        setCourses(response.data.enrolledCourses);
      }
    } catch (error) {
      console.log('error: ', error);
      toast({
        position: 'top',
        title: error.response.data.error,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }

  useEffect(() => {
    getAllCourses();
    localStorage.getItem("role") === "student" && getStudent();
    // eslint-disable-next-line
  }, [])


  if (courses.length > 0) {
    return (
      <>
        {courses.map((course, id) => (
          <Card key={id} mb={5}>
            <CardBody>
              <Stack divider={<StackDivider />} spacing='4'>
                <Box>
                  <Heading size='xs' textTransform='uppercase'>
                    Course Name
                  </Heading>
                  <Text pt='2' fontSize='sm'>
                    {course.coursename}
                  </Text>
                </Box>
                <Box>
                  <Heading size='xs' textTransform='uppercase'>
                    Auther Name
                  </Heading>
                  <Text pt='2' fontSize='sm'>
                    {course.adminname}
                  </Text>
                </Box>
                <Box>
                  <Heading size='xs' textTransform='uppercase'>
                    Course Description
                  </Heading>
                  <Text pt='2' fontSize='sm'>
                    {course.coursedesc}
                  </Text>
                </Box>
                <Box>
                  <Heading size='xs' textTransform='uppercase'>
                    PDF File
                  </Heading>

                  {/* Show PDF to student */}
                  <Flex alignItems="center" gap={2}>
                    <FileEarmarkPdfFill />
                    <Text pt='2' fontSize='sm'>
                      <Link href={course.pdf} isExternal>
                        Click to view
                      </Link>
                    </Text>
                  </Flex>
                </Box>

                {/* Show enroll and disenroll option to student */}
                {studentData.includes(course._id) ? <>
                  <Box>
                    <Heading size='xs' textTransform='uppercase'>
                      Take action
                    </Heading>
                    <Button colorScheme='red' size='xs' mt="2" onClick={() => handleDisenroll(course._id)}>Disenroll From This Course</Button>
                  </Box>
                </> : <>
                  <Box>
                    <Heading size='xs' textTransform='uppercase'>
                      Take action
                    </Heading>
                    <Button colorScheme='whatsapp' size='xs' mt="2" onClick={() => handleEnroll(course._id)}>Enroll In This Course</Button>
                  </Box>
                </>
                }

              </Stack>
            </CardBody>
          </Card >
        ))}
      </>
    )
  } else {
    return (<>
      <Heading as='h4' size='md'>
        No course available!
      </Heading>
    </>)
  }
}

export default StudentCourses
