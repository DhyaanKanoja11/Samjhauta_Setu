# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0     | :white_check_mark: |

---

## Reporting a Vulnerability

We take the security of SamjhautaSetu seriously. If you discover a security vulnerability, please report it responsibly.

### Contact

**Email:** dhyaandk11@gmail.com  
**Subject:** `[SECURITY] Brief description of the issue`

### Required Information

1. **Description** - Clear explanation of the vulnerability
2. **Steps to Reproduce** - Detailed reproduction steps
3. **Potential Impact** - What could an attacker accomplish
4. **Affected Component** - Frontend/Backend/Chatbot
5. **Your Contact** - For follow-up questions

### Response Timeline

- **Acknowledgment:** Within 48 hours
- **Initial Assessment:** Within 5 business days
- **Fix Deployment:** 7-30 days depending on severity

---

## Severity Levels

| Severity | Examples | Response Time |
|----------|----------|---------------|
| **Critical** | Remote code execution, authentication bypass, data breach | 24-48 hours |
| **High** | Privilege escalation, SQL injection, XSS | 7-14 days |
| **Medium** | Information disclosure, CSRF, DoS | 14-30 days |
| **Low** | Minor information leaks, best practice violations | 30-60 days |

---

## Security Features

SamjhautaSetu implements:

**Network Security**
- HTTPS/TLS 1.3 encryption
- HSTS and secure headers (CSP, X-Frame-Options)

**Application Security**
- Rate limiting (100 requests/hour per IP)
- CORS policy enforcement
- Input validation and sanitization
- File type and size restrictions

**Data Protection**
- No persistent user data storage
- Immediate file deletion after processing
- UUID-based file naming
- Environment variable protection

---

## Responsible Disclosure

### Please Do
- Report privately to dhyaandk11@gmail.com
- Allow time for us to fix before public disclosure
- Provide detailed reproduction steps

### Please Don't
- Publicly disclose before we've addressed it
- Access or modify other users' data
- Perform DoS attacks on production systems

---

## Acknowledgments

We credit security researchers (with permission) who responsibly disclose vulnerabilities.

*List will be updated as vulnerabilities are reported and fixed.*

---

**Security Contact:** dhyaandk11@gmail.com  
**Team:** Team Binary Brains  
**Last Updated:** February 2026

---

*This security policy is subject to change. Please check regularly for updates.*
