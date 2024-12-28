export const subjects = ['ABA', 'AF', 'AFRSTY', 'AMST', 'ANTH', 'ARABIC', 'ART', 'ASAMST', 'ASIAN', 'ASP', 'BC', 'BIOCHM', 'BIOL', 'BUSADM', 'CAPS', 'CHEM', 'CHINSE', 'CINE', 'CLSICS', 'COMM', 'COUNSL', 'CRW', 'CS', 'CSP', 'DANCE', 'ECHD', 'ECON', 'EDC U', 'EHS', 'ENGIN', 'ENGL', 'ENGLPL', 'ENVSCI', 'ENVSTY', 'ESL', 'FOUN', 'FRENCH', 'GERMAN', 'GERON', 'GLBAFF', 'GREEK', 'HIST', 'HLTH', 'HONORS', 'HUMAN', 'HUMCTR', 'INTR-D', 'IR', 'IT', 'ITAL', 'JAPAN', 'LABOR', 'LATAM', 'LATIN', 'LATSTY', 'LING', 'MATH', 'MGT', 'MKT', 'MLLC', 'MSIS', 'MUSIC', 'NAIS', 'NAV', 'NURSNG', 'PHIL', 'PHILLAW', 'PHYSIC', 'POLSCI', 'PORT', 'PRFTRN', 'PSYCH', 'PUBHTH', 'RELSTY', 'RUSS', 'SCSM', 'SEMINR', 'SL', 'SOCIOL', 'SPAN', 'THRART', 'UPCD', 'USEA', 'VIET', 'WGS'];
export const attributes = ['AR', 'HU', 'SB', 'NS', 'MT', 'WL', 'WC', 'US', 'INTL'];
export const locations = ['Wheatley', 'University Hall', 'McCormack', 'On-line course', 'Snowden'];

export const courseUrl = ((subject: string, number: number) => {
    return `https://courses.umb.edu/course_catalog/course_info/ugrd_${subject}_all_${number}`;
})