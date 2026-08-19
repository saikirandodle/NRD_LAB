from lxml import etree

xml = etree.parse("bookstore-dtd.xml")
dtd = etree.DTD("bookstore.dtd")

if dtd.validate(xml):
    print("DTD Validation: Valid")
else:
    print("DTD Validation: Invalid")
    print(dtd.error_log)
