# Security Policy

## Supported Versions

Only the latest version of this application is currently being supported with security updates.

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

We take the security of CodeTask seriously. If you believe you've found a security vulnerability, please follow these steps:

1. **Do not disclose the vulnerability publicly**
2. **Email us at security@example.com** with details about the vulnerability
3. Include the following information:
   - Type of vulnerability
   - Full paths of source files related to the vulnerability
   - Steps to reproduce
   - Impact of the vulnerability
   - Any potential solutions you might have identified

## Security Measures

CodeTask implements several security features:

1. **Content Security Policy**: Restricts what resources can be loaded
2. **XSS Protection**: Guards against cross-site scripting attacks
3. **X-Frame-Options**: Prevents clickjacking
4. **Referrer Policy**: Controls information passed to other websites
5. **HTTP-only cookies**: Mitigates client-side script access to sensitive cookies
6. **CSRF Protection**: Guards against cross-site request forgery

## Dependencies and Third-Party Services

We regularly scan for vulnerabilities in our dependencies using GitHub's Dependabot.

## Security Updates

Security updates are deployed as soon as they are available. We maintain transparency about security issues and fixes in our release notes. 