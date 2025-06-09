import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material';

const data = [
  {
    name: 'Alice',
    age: 21,
    subjects: [
      { subject: 'Math', grade: 'A' },
      { subject: 'Science', grade: 'B+' }
    ]
  },
  {
    name: 'Bob',
    age: 22,
    subjects: [
      { subject: 'English', grade: 'A-' },
      { subject: 'History', grade: 'B' }
    ]
  }
];

export default function NestedTableCell() {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Age</TableCell>
            <TableCell>Subjects</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((student) => (
            <TableRow key={student.name}>
              <TableCell>{student.name}</TableCell>
              <TableCell>{student.age}</TableCell>
              <TableCell>
                {/* Nested table inside a cell */}
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Subject</TableCell>
                      <TableCell>Grade</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {student.subjects.map((subj, i) => (
                      <TableRow key={i}>
                        <TableCell>{subj.subject}</TableCell>
                        <TableCell>{subj.grade}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
